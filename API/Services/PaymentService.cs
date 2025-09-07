using System;
using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentService(IConfiguration config)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();
        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var option = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await service.CreateAsync(option);
        }
        else
        {
            var option = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };
            intent = await service.UpdateAsync(basket.PaymentIntentId, option);
        }
        return intent;
    }
}
