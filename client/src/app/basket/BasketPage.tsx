// src/app/basket/BasketPage.tsx
import { Container, Typography, Box } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";
import BasketItem from "./BasketItem";
import OrderSummary from "../shared/components/OrderSummary";

export default function BasketPage() {
  const { data: basket, isLoading } = useFetchBasketQuery();

  if (isLoading) return <Typography>Loading basket...</Typography>;

  if (!basket || basket.items.length === 0) {
    return <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4">Your basket is empty</Typography>
    </Container>;
  }

  // 요약 정보는 OrderSummary 내부의 useBasket 훅에서 계산

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
          <OrderSummary />
        </Box>
      </Box>
    </Container>
  );
}
