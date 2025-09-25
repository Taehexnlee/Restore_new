// src/features/orders/OrderDetailsPage.tsx
import {
    Box,
    Button,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Container,
  } from "@mui/material";
  import { Link as RouterLink, useParams } from "react-router-dom";
  import { useFetchOrderDetailsQuery } from "./ordersApi";
  import { format, isValid, parseISO } from "date-fns";
import { formatAddressFromOrder, formatPaymentFromOrder, currencyFormat } from "../../lib/util";
  
  
  export default function OrderDetailsPage() {
    const { id } = useParams();
    const { data: order, isLoading, isError } = useFetchOrderDetailsQuery(Number(id!), { skip: !id });
  
    if (isLoading) {
      return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h5">Loading order…</Typography>
        </Container>
      );
    }
  
    if (isError || !order) {
      return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h5">Order not found.</Typography>
        </Container>
      );
    }
  
    const addressStr = formatAddressFromOrder(order);
    const paymentStr = formatPaymentFromOrder(order);
  
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Card sx={{ p: 2, mx: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5">Order summary #{order.id}</Typography>
            <Button component={RouterLink} to="/orders" variant="outlined">
              Back to orders
            </Button>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Billing & Delivery
          </Typography>
  
          <Box component="dl">
            <Typography component="dt" variant="subtitle1" fontWeight={500}>
              Shipping address
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={300}>
              {addressStr}
            </Typography>
          </Box>
  
          <Box component="dl" sx={{ mt: 1 }}>
            <Typography component="dt" variant="subtitle1" fontWeight={500}>
              Payment info
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={300}>
              {paymentStr}
            </Typography>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Order details
          </Typography>
          <Box component="dl">
            <Typography component="dt" variant="subtitle1" fontWeight={500}>
              Email
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={300}>
              {order.buyerEmail}
            </Typography>
          </Box>
  
          <Box component="dl" sx={{ mt: 1 }}>
            <Typography component="dt" variant="subtitle1" fontWeight={500}>
              Status
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={300}>
              {order.orderStatus}
            </Typography>
          </Box>
  
          <Box component="dl" sx={{ mt: 1 }}>
            <Typography component="dt" variant="subtitle1" fontWeight={500}>
              Order date
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={300}>
              {(() => {
                const d = parseISO(order.orderDate);
                if (isValid(d)) return format(d, "dd MMM yyyy HH:mm");
                const d2 = new Date(order.orderDate);
                return isValid(d2) ? format(d2, "dd MMM yyyy HH:mm") : order.orderDate;
              })()}
            </Typography>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          {/* Item table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Unit price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Line total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((it) => (
                <TableRow key={it.productId}>
                  <TableCell>{it.name}</TableCell>
                  <TableCell align="right">{currencyFormat(it.price)}</TableCell>
                  <TableCell align="right">{it.quantity}</TableCell>
                  <TableCell align="right">
                    {currencyFormat(it.price * it.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          {/* Totals */}
          <Box sx={{ mt: 2 }}>
            <Box
              component="dl"
              sx={{ display: "flex", justifyContent: "space-between", mx: 3 }}
            >
              <Typography component="dt" variant="subtitle1" fontWeight={500}>
                Subtotal
              </Typography>
              <Typography component="dd" variant="body2" fontWeight={300}>
                {currencyFormat(order.subtotal)}
              </Typography>
            </Box>
  
            <Box
              component="dl"
              sx={{ display: "flex", justifyContent: "space-between", mx: 3 }}
            >
              <Typography component="dt" variant="subtitle1" fontWeight={500} color="success.main">
                Discount
              </Typography>
              <Typography component="dd" variant="body2" fontWeight={300} color="success.main">
                {currencyFormat(order.discount)}
              </Typography>
            </Box>
  
            <Box
              component="dl"
              sx={{ display: "flex", justifyContent: "space-between", mx: 3 }}
            >
              <Typography component="dt" variant="subtitle1" fontWeight={500}>
                Delivery fee
              </Typography>
              <Typography component="dd" variant="body2" fontWeight={300}>
                {currencyFormat(order.deliveryFee)}
              </Typography>
            </Box>
  
            <Divider sx={{ my: 1.5 }} />
  
            <Box
              component="dl"
              sx={{ display: "flex", justifyContent: "space-between", mx: 3 }}
            >
              <Typography component="dt" variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography component="dd" variant="subtitle1" fontWeight={700}>
                {currencyFormat(order.total)}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }
