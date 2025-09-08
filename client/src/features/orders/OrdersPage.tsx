// src/features/orders/OrdersPage.tsx
import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import { useFetchOrdersQuery } from "./ordersApi";
  import type { Order } from "../../app/models/order";
  import { format, isValid, parseISO } from "date-fns";
  import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { currencyFormat } from "../../lib/util"; // ✅ 공용 util 사용

  const isRecord = (val: unknown): val is Record<string, unknown> =>
    typeof val === "object" && val !== null;

  export default function OrdersPage() {
    const navigate = useNavigate();
    const { data: orders, isLoading, isError, error } = useFetchOrdersQuery();

    const getErrorMessage = (err: FetchBaseQueryError | SerializedError | undefined) => {
      if (!err) return "Unknown error";
      if ("status" in err) {
        const data = err.data;
        if (typeof data === "string") return data;
        if (isRecord(data)) {
          const title = typeof data.title === "string" ? data.title : undefined;
          const message = typeof data.message === "string" ? data.message : undefined;
          const errorText = typeof data.error === "string" ? data.error : undefined;
          return title ?? message ?? errorText ?? `HTTP ${String(err.status)}`;
        }
        return `HTTP ${String(err.status)}`;
      }
      if ("message" in err) return err.message || "Unknown error";
      return "Unknown error";
    };

    const formatDateTime = (iso: string) => {
      // Try parse ISO; fall back safely if invalid
      const d = parseISO(iso);
      if (isValid(d)) return format(d, "dd MMM yyyy HH:mm");
      const d2 = new Date(iso);
      return isValid(d2) ? format(d2, "dd MMM yyyy HH:mm") : iso;
    };
  
    if (isLoading) {
      return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h5">Loading orders…</Typography>
        </Container>
      );
    }
  
    if (isError) {
      return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load orders
          </Typography>
          <Typography variant="body2">{getErrorMessage(error as FetchBaseQueryError | SerializedError)}</Typography>
        </Container>
      );
    }
  
    if (!orders || orders.length === 0) {
      return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h5">No orders available</Typography>
        </Container>
      );
    }
  
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          My Orders
        </Typography>
  
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="center">Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow
                  key={order.id}
                  hover
                  onClick={() => navigate(`/orders/${order.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="center">#{order.id}</TableCell>
                  <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                  <TableCell>{currencyFormat(order.total)}</TableCell>
                  <TableCell>
                    <Box component="span" sx={{ textTransform: "capitalize" }}>
                      {order.orderStatus}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    );
  }
