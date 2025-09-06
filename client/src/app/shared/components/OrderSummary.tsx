// src/app/shared/OrderSummary.tsx
import { Box, Paper, Typography, Divider, Button, TextField, Stack } from "@mui/material";
import { currencyFormat } from "../../../lib/util";
import { Link, useLocation } from "react-router-dom";
import { useFetchBasketQuery } from "../../basket/basketApi";


export default function OrderSummary() {
  const {data: basket} = useFetchBasketQuery();
  const subtotal = basket?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500; // cents
  const total = subtotal + deliveryFee;
  const location = useLocation();

  return (
    <Box sx={{ position: "sticky", top: 88 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Orders over {currencyFormat(10000)} qualify for free delivery.
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography component="span">Subtotal</Typography>
            <Typography component="span">{currencyFormat(subtotal)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography component="span">Delivery fee</Typography>
            <Typography component="span">{currencyFormat(deliveryFee)}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="span">Total</Typography>
          <Typography variant="h6" component="span">{currencyFormat(total)}</Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          {!location.pathname.includes("checkout") &&
          <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              sx={{ height: 48 }}

            >
              Checkout
          </Button>}
            <Button
              component={Link}
              to="/catalog"
              variant="outlined"
              fullWidth
              sx={{ height: 48 }}
            >
              Continue shopping
            </Button>
        </Stack>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField fullWidth size="small" label="Coupon code" />
          <Button variant="outlined">Apply</Button>
        </Box>
      </Paper>
    </Box>
  );
}