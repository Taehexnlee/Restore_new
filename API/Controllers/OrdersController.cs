using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context) => _context = context;

        // GET /orders — retrieve all orders for the current user
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            var email = User.GetUsername();

            var orders = await _context.Orders
                .Where(o => o.BuyerEmail == email)
                .OrderByDescending(o => o.OrderDate)
                .ProjectToDto()                 // Map entity to DTO on the server
                .ToListAsync();

            return orders;
        }

        // GET /orders/{id} — retrieve a specific order for the current user
       [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
        {
            var email = User.GetUsername();

            var order = await _context.Orders
                .Where(o => o.BuyerEmail == email && o.Id == id)
                .ProjectToDto()                 // Map entity to DTO on the server
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();
            return order;
        }

        // POST /orders — create a new order
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            // 1) Load the basket including items
            var basketId = Request.Cookies["basketId"];
            var basket = await _context.Baskets
                .Include(b => b.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(b => b.BasketId == basketId);

            if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                return BadRequest(new ProblemDetails { Title = "Basket is empty or not found" });
            }
            // 2) Convert basket items into order item snapshots
            var items = CreateOrderItems(basket.Items);
            if(items == null)
                return BadRequest(new ProblemDetails { Title = "One or more items in your basket are no longer available in the desired quantity." });
            // 3) Compute subtotal and delivery fee (stored in cents)
            long subtotal = items.Sum(i => i.Price * i.Quantity);
            long deliveryFee = CalculateDeliveryFee(subtotal);

            // 4) Construct the order entity
            var order = new Order
            {
                BuyerEmail     = User.GetUsername(),
                ShippingAddress= orderDto.ShippingAddress,
                OrderItems     = items,
                Subtotal       = subtotal,
                DeliveryFee    = deliveryFee,
                PaymentSummary = orderDto.PaymentSummary,
                PaymentIntentId= basket.PaymentIntentId // Link to the stored payment intent
                // OrderStatus defaults to Pending; OrderDate defaults to UtcNow
            };

            _context.Orders.Add(order);

            // 5) Clean up basket entity and client cookie
            _context.Baskets.Remove(basket);
            Response.Cookies.Delete("basketId");

            // 6) Persist changes and respond
            var changes = await _context.SaveChangesAsync();
            if (changes <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "Problem creating order" });
            }

            var dto = order.ToDto();

            return CreatedAtAction(
                nameof(GetOrderDetails),
                new { id = order.Id },
                order.ToDto()
            );
        }

        /// <summary>
        /// Convert basket items into order item snapshots
        /// </summary>
        /// </summary>
        private static List<OrderItem>? CreateOrderItems(ICollection<BasketItem> items)
        {
            var orderItems = new List<OrderItem>();

            foreach (var item in items)
            {
                // Ensure inventory is available (product is already included)
                if (item.Product.QuantityInStock < item.Quantity)
                {
                    // Insufficient stock aborts the entire order creation
                    return null;
                }

                var orderItem = new OrderItem
                {
                    ItemOrdered = new ProductItemOrdered
                    {
                        ProductId  = item.ProductId,
                        Name       = item.Product.Name,
                        PictureUrl = item.Product.PictureUrl
                    },
                    Price    = item.Product.Price,   // Price stored in cents
                    Quantity = item.Quantity
                };

                orderItems.Add(orderItem);

                // Decrement on-hand inventory
                item.Product.QuantityInStock -= item.Quantity;
            }

            return orderItems;
        }

        /// <summary>
        /// Calculate delivery fee: orders above $100 ship free, otherwise $5 (in cents)
        /// </summary>
        private static long CalculateDeliveryFee(long subtotal) => subtotal > 10_000 ? 0 : 500;
    }
}
