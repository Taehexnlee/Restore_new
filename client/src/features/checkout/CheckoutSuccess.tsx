// src/features/checkout/CheckoutSuccess.tsx
import { Box, Typography } from "@mui/material";

export default function CheckoutSuccess() {
  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Payment successful 🎉
      </Typography>
      <Typography color="text.secondary">
        Thank you for your order. We’ve received your payment.
      </Typography>
    </Box>
  );
}