// src/features/checkout/CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Order } from "../../app/models/order";
import { useBasket } from "../../lib/hooks/useBasket";
import { formatAddressFromOrder, formatPaymentFromOrder, currencyFormat } from "../../lib/util";

export default function CheckoutSuccess() {
  const [order, setOrder] = useState<Order | null>(null);
  const { clearBasket } = useBasket();

  useEffect(() => {
    // 1) Restore order from local cache
    const cached = localStorage.getItem("checkout:pendingOrder");
    if (cached) {
      try {
        setOrder(JSON.parse(cached));
      } catch {
        setOrder(null);
      }
    }
    // 2) Clear the basket
    clearBasket().catch(() => {});
    // 3) Remove cached payload
    localStorage.removeItem("checkout:pendingOrder");
  }, [clearBasket]);

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h6">Problem accessing the order.</Typography>
      </Container>
    );
  }

  const addressStr = formatAddressFromOrder(order);
  const paymentStr = formatPaymentFromOrder(order);

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Thanks for your fake order!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your order <strong>#{order.id}</strong> will never be processed (this is a demo).
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Order date
          </Typography>
          <Typography fontWeight="bold">{new Date(order.orderDate).toLocaleString()}</Typography>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Payment method
          </Typography>
          <Typography fontWeight="bold">{paymentStr}</Typography>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Shipping address
          </Typography>
          <Typography fontWeight="bold" textAlign="right">
            {addressStr}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Amount
          </Typography>
          <Typography fontWeight="bold">{currencyFormat(order.total)}</Typography>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={`/orders/${order.id}`}
        >
          View your order
        </Button>
        <Button variant="outlined" color="primary" component={RouterLink} to="/catalog">
          Continue shopping
        </Button>
      </Box>
    </Container>
  );
}
