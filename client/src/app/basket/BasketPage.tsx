// src/app/basket/BasketPage.tsx
import { Container, Typography, Box } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";
import BasketItem from "./BasketItem";
import OrderSummary from "../shared/components/OrderSummary";
import type { Item } from "../models/basket";

export default function BasketPage() {
  const { data: basket, isLoading } = useFetchBasketQuery();

  if (isLoading) return <Typography>Loading basket...</Typography>;

  if (!basket || basket.items.length === 0) {
    return <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4">Your basket is empty</Typography>
    </Container>;
  }

  // subtotal(센트)
  const subtotal = basket.items.reduce<number>(
    (sum, item: Item) => sum + item.price * item.quantity,
    0
  );

  // 배송비(센트): $100(=10000c) 초과면 무료, 아니면 $5(=500c)
  const deliveryFee = subtotal > 10000 ? 0 : 500;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" gutterBottom>
        Your Basket
      </Typography>

      {/* 메인 영역: 좌(아이템 리스트) / 우(주문 요약) */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-start" },
        }}
      >
        {/* 왼쪽: 장바구니 아이템들 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {basket.items.map((item) => (
            <BasketItem key={item.productId} item={item} />
          ))}
        </Box>

        {/* 오른쪽: 주문 요약 (OrderSummary 자체가 Paper 포함) */}
        <Box sx={{ width: { xs: "100%", md: 380 } }}>
          <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} />
        </Box>
      </Box>
    </Container>
  );
}