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

  // Totals are computed inside OrderSummary via the useBasket hook

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" gutterBottom>
        Your Basket
      </Typography>

      {/* Layout: items on the left, summary on the right */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-start" },
        }}
      >
        {/* Left: basket items */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {basket.items.map((item) => (
            <BasketItem key={item.productId} item={item} />
          ))}
        </Box>

        {/* Right: order summary (OrderSummary already renders a Paper) */}
        <Box sx={{ width: { xs: "100%", md: 380 } }}>
          <OrderSummary />
        </Box>
      </Box>
    </Container>
  );
}
