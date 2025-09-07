// src/features/checkout/Review.tsx
import {
  Box, Divider, Table, TableBody, TableCell,
  TableContainer, TableRow, Typography,
} from "@mui/material";
import type { ConfirmationToken } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";

type Props = { confirmationToken: ConfirmationToken | null };

export default function Review({ confirmationToken }: Props) {
  const { basket } = useBasket();

  const addressString = () => {
    const shipping = confirmationToken?.shipping;
    const name = shipping?.name;
    const a = shipping?.address;
    if (!name || !a) return "";
    const line2 = a.line2 ? `\n${a.line2}` : "";
    return `${name}\n${a.line1}${line2}\n${a.city}, ${a.state} ${a.postal_code}\n${a.country}`;
  };

  const paymentString = () => {
    const card = confirmationToken?.payment_method_preview?.card; // <-- 연쇄 ?. 사용
    if (!card) return "";
    const brand = (card.brand || "").toUpperCase();
    const last4 = card.last4 || "••••";
    return `Card ${brand} **** ${last4}, Exp: ${card.exp_month}/${card.exp_year}`;
  };

  const currency = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })
      .format((cents ?? 0) / 100);

  return (
    <>
      <Box mt={4} width="100%">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Billing & Delivery Information
        </Typography>

        <dl>
          <Typography component="dt" mt={1} color="secondary" fontWeight="medium">
            Shipping address
          </Typography>
          <Typography
            component="dd"
            mt={1}
            color="text.secondary"
            sx={{ whiteSpace: "pre-line" }}  // \n 줄바꿈 표시
          >
            {addressString() || "—"}
          </Typography>

          <Typography component="dt" mt={1} color="secondary" fontWeight="medium">
            Payment details
          </Typography>
          <Typography component="dd" mt={1} color="text.secondary">
            {paymentString() || "—"}
          </Typography>
        </dl>
      </Box>

      <Box mt={6} mx="auto">
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table size="small">
            <TableBody>
              {basket?.items.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ borderBottom: "1px solid rgba(224,224,224,1)" }}
                >
                  <TableCell sx={{ py: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                      <Typography>{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ p: 4 }}>
                    x {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ p: 4 }}>
                    {currency(item.price)}
                  </TableCell>
                </TableRow>
              ))}
              {!basket?.items?.length && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No items in basket.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}