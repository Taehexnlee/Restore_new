// src/features/checkout/CheckoutPage.tsx
import { Container, Grid, Typography } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useCreatePaymentIntentMutation } from "./checkoutApi";
import CheckoutStepper from "./CheckoutStepper";
import { useEffect, useMemo, useRef } from "react";
import { useFetchBasketQuery } from "../../app/basket/basketApi";
import OrderSummary from "../../app/shared/components/OrderSummary";
import { useAppSelector } from "../../app/store/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK!);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery();
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();
  const created = useRef(false);
  const darkMode = useAppSelector((state) => state.ui.darkMode); // ✅ 다크모드 가져오기

  useEffect(() => {
    if (!created.current) {
      createPaymentIntent();
      created.current = true;
    }
  }, [createPaymentIntent]);

  const options = useMemo<StripeElementsOptions | undefined>(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: "floating",
        theme: darkMode ? "night" : "stripe", // ✅ Stripe 테마 적용 (typesafe)
      },
    };
  }, [basket?.clientSecret, darkMode]);

  if (!stripePromise || !options || isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h6">Loading checkout...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Grid container spacing={6}>
        {/* 좌측 CheckoutStepper */}
        <Grid item xs={12} md={8}>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        </Grid>

        {/* 우측 주문 요약 */}
        <Grid item xs={12} md={4}>
          <OrderSummary />  {/* ✅ 다시 추가 */}
        </Grid>
      </Grid>
    </Container>
  );
}
