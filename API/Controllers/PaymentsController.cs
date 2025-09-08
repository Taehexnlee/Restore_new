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

        // 최초 생성 시에만 세팅
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

    // POST /api/payments/webhook (Stripe가 호출)
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        // 1) Raw body 읽기
        string json;
        using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
        {
            json = await reader.ReadToEndAsync();
        }

        logger.LogInformation("📩 Stripe Webhook 호출됨. Raw Body: {Body}", json);

        try
        {
            // 2) Stripe 서명 검증 + Event 구성
            var stripeEvent = ConstructStripeEvent(json);

            logger.LogInformation("✅ Stripe 이벤트 수신: {Type}, ID: {Id}",
                stripeEvent.Type, stripeEvent.Id);

            // 3) 이벤트 타입으로 분기
            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    await HandlePaymentIntentSucceeded((PaymentIntent)stripeEvent.Data.Object);
                    break;

                case "payment_intent.payment_failed":
                    await HandlePaymentIntentFailed((PaymentIntent)stripeEvent.Data.Object);
                    break;

                default:
                    logger.LogWarning("⚠️ 처리되지 않은 Stripe 이벤트 타입: {Type}", stripeEvent.Type);
                    break;
            }

            // 4) Stripe에 OK 반환
            return Ok();
        }
        catch (StripeException sx)
        {
            logger.LogError(sx, "❌ Stripe webhook StripeException 발생");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Stripe webhook 예기치 못한 오류 발생");
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

        // 검증 & 파싱
        return EventUtility.ConstructEvent(json, signatureHeader, whSecret);
    }
    catch (StripeException sx)
    {
        logger.LogError(sx, "🔒 Stripe signature verification failed.");
        throw; // 바깥 StripeException 핸들러에서 처리
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to construct Stripe event (non-Stripe error).");
        throw;
    }
}

    // 결제 실패 처리 (주문 없으면 OK로 종료)
    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id);

        if (order == null)
        {
            logger.LogWarning("PaymentFailed webhook: order not found for intent {IntentId}", intent.Id);
            return; // 웹훅은 200으로 마무리(상위에서 Ok 반환)
        }

        // 재고 롤백
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

    // 결제 성공 처리 (주문 없으면 OK로 종료, 금액 불일치 체크)
    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id);

        if (order == null)
        {
            logger.LogWarning("PaymentSucceeded webhook: order not found for intent {IntentId}", intent.Id);
            return; // 웹훅은 200으로 마무리
        }

        // Stripe는 일부 플로우에서 AmountReceived 사용 권장
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

        // 장바구니 제거
        var basket = await context.Baskets.FirstOrDefaultAsync(b => b.PaymentIntentId == intent.Id);
        if (basket != null)
        {
            context.Baskets.Remove(basket);
            logger.LogInformation("Basket removed for PaymentIntent {PaymentIntentId}", intent.Id);
        }

        await context.SaveChangesAsync();
    }
}