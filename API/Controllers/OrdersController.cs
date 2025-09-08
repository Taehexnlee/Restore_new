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

        // GET /orders (이미 이전 단계에서 구현)
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            var email = User.GetUsername();

            var orders = await _context.Orders
                .Where(o => o.BuyerEmail == email)
                .OrderByDescending(o => o.OrderDate)
                .ProjectToDto()                 // ✅ Projection
                .ToListAsync();

            return orders;
        }

        // GET /orders/{id} (이미 이전 단계에서 구현)
       [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
        {
            var email = User.GetUsername();

            var order = await _context.Orders
                .Where(o => o.BuyerEmail == email && o.Id == id)
                .ProjectToDto()                 // ✅ Projection
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();
            return order;
        }

        // POST /orders  — 주문 생성
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            // 1) 장바구니 로드 (아이템 포함)
            var basketId = Request.Cookies["basketId"];
            var basket = await _context.Baskets
                .Include(b => b.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(b => b.BasketId == basketId);

            if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                return BadRequest(new ProblemDetails { Title = "Basket is empty or not found" });
            }
            // 2) 장바구니 → 주문 아이템 스냅샷 변환
            var items = CreateOrderItems(basket.Items);
            if(items == null)
                return BadRequest(new ProblemDetails { Title = "One or more items in your basket are no longer available in the desired quantity." });
            // 3) 소계/배송비 계산 (센트 단위 long)
            long subtotal = items.Sum(i => i.Price * i.Quantity);
            long deliveryFee = CalculateDeliveryFee(subtotal);

            // 4) 주문 엔티티 생성
            var order = new Order
            {
                BuyerEmail     = User.GetUsername(),
                ShippingAddress= orderDto.ShippingAddress,
                OrderItems     = items,
                Subtotal       = subtotal,
                DeliveryFee    = deliveryFee,
                PaymentSummary = orderDto.PaymentSummary,
                PaymentIntentId= basket.PaymentIntentId // 장바구니에 저장해 둔 Intent Id
                // OrderStatus는 기본값(Pending), OrderDate는 UtcNow 초기화
            };

            _context.Orders.Add(order);

            // 5) 장바구니 정리 (서버 측 엔티티 & 클라이언트 쿠키)
            _context.Baskets.Remove(basket);
            Response.Cookies.Delete("basketId");

            // 6) 저장 & 응답
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
        /// 장바구니 아이템을 주문 아이템(스냅샷)으로 변환
        /// </summary>
        /// </summary>
        private static List<OrderItem>? CreateOrderItems(ICollection<BasketItem> items)
        {
            var orderItems = new List<OrderItem>();

            foreach (var item in items)
            {
                // 재고 검증 (상품 정보는 Include 되어 있다고 가정)
                if (item.Product.QuantityInStock < item.Quantity)
                {
                    // 재고 부족 → 전체 생성 실패 신호
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
                    Price    = item.Product.Price,   // cents
                    Quantity = item.Quantity
                };

                orderItems.Add(orderItem);

                // 재고 차감
                item.Product.QuantityInStock -= item.Quantity;
            }

            return orderItems;
        }

        /// <summary>
        /// 배송비 계산: $100 이상 무료, 아니면 $5 (센트 기준)
        /// </summary>
        private static long CalculateDeliveryFee(long subtotal) => subtotal > 10_000 ? 0 : 500;
    }
}