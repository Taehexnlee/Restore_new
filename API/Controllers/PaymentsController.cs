using System.Text;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(
    PaymentService paymentService,
    StoreContext context,
    IConfiguration config,
    ILogger<PaymentsController> logger
) : BaseApiController
{
    // POST /api/payments
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        if (basket == null) return NotFound();

        var intent = await paymentService.CreateOrUpdatePaymentIntent(basket);
        if (intent == null)
            return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

        // Set these only on the first creation
        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        if (context.ChangeTracker.HasChanges())
        {
            var result = await context.SaveChangesAsync() > 0;
            if (!result)
                return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
        }

        return basket.ToDto();
    }

    // POST /api/payments/webhook — invoked by Stripe
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        // 1) Read the raw body
        string json;
        using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
        {
            json = await reader.ReadToEndAsync();
        }

        logger.LogInformation("📩 Stripe webhook received. Raw Body: {Body}", json);

        try
        {
            // 2) Verify Stripe signature and construct the Event
            var stripeEvent = ConstructStripeEvent(json);

            logger.LogInformation("✅ Stripe event type {Type}, ID: {Id}",
                stripeEvent.Type, stripeEvent.Id);

            // 3) Branch on event type
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    await HandlePaymentIntentSucceeded((PaymentIntent)stripeEvent.Data.Object);
                    break;

                case "payment_intent.payment_failed":
                    await HandlePaymentIntentFailed((PaymentIntent)stripeEvent.Data.Object);
                    break;

                default:
                    logger.LogWarning("⚠️ Unhandled Stripe event type: {Type}", stripeEvent.Type);
                    break;
            }

            // 4) Return OK to Stripe
            return Ok();
        }
        catch (StripeException sx)
        {
            logger.LogError(sx, "❌ Stripe webhook threw a StripeException");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Stripe webhook encountered an unexpected error");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");
        }
    }
    private Event ConstructStripeEvent(string json)
{
    try
    {
        var signatureHeader = Request.Headers["Stripe-Signature"].ToString();
        var whSecret = config["StripeSettings:WebhookSecret"];

        if (string.IsNullOrWhiteSpace(signatureHeader))
            throw new StripeException("Missing Stripe-Signature header.");

        if (string.IsNullOrWhiteSpace(whSecret))
            throw new StripeException("Missing StripeSettings:WebhookSecret");

        // Verify signature and parse event
        return EventUtility.ConstructEvent(json, signatureHeader, whSecret);
    }
    catch (StripeException sx)
    {
        logger.LogError(sx, "🔒 Stripe signature verification failed.");
        throw; // Outer handler will deal with this
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to construct Stripe event (non-Stripe error).");
        throw;
    }
}

    // Handle failed payments; if no order is found simply return
    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id);

        if (order == null)
        {
            logger.LogWarning("PaymentFailed webhook: order not found for intent {IntentId}", intent.Id);
            return; // Upstream webhook handler still returns 200
        }

        // Restore inventory
        foreach (var item in order.OrderItems)
        {
            var product = await context.Products.FindAsync(item.ItemOrdered.ProductId);
            if (product == null)
            {
                logger.LogError("Product not found when rolling back stock. ProductId: {Pid}", item.ItemOrdered.ProductId);
                continue;
            }
            product.QuantityInStock += item.Quantity;
        }

        order.OrderStatus = OrderStatus.PaymentFailed;
        await context.SaveChangesAsync();
        logger.LogInformation("Order {OrderId} marked as PaymentFailed, stock rolled back", order.Id);
    }

    // Handle successful payments and detect mismatched totals
    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id);

        if (order == null)
        {
            logger.LogWarning("PaymentSucceeded webhook: order not found for intent {IntentId}", intent.Id);
            return; // Upstream webhook handler still returns 200
        }

        // Prefer AmountReceived when available per Stripe guidance
        var paid = intent.AmountReceived > 0 ? intent.AmountReceived : intent.Amount;

        if (order.GetTotal() != paid)
        {
            order.OrderStatus = OrderStatus.PaymentMismatch;
            logger.LogWarning("Order {OrderId} PaymentMismatch. Order total {OrderTotal}, Paid {Paid}",
                order.Id, order.GetTotal(), paid);
        }
        else
        {
            order.OrderStatus = OrderStatus.PaymentReceived;
            logger.LogInformation("Order {OrderId} marked as PaymentReceived", order.Id);
        }

        // Remove basket tied to this payment intent
        var basket = await context.Baskets.FirstOrDefaultAsync(b => b.PaymentIntentId == intent.Id);
        if (basket != null)
        {
            context.Baskets.Remove(basket);
            logger.LogInformation("Basket removed for PaymentIntent {PaymentIntentId}", intent.Id);
        }

        await context.SaveChangesAsync();
    }
}
