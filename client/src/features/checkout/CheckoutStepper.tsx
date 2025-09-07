// src/features/checkout/CheckoutStepper.tsx
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Paper, Stepper, Step, StepLabel, Box, Button, Typography,
  FormControlLabel, Checkbox,
} from "@mui/material";
import {
  AddressElement, PaymentElement, useElements, useStripe,
} from "@stripe/react-stripe-js";
import type {
  ConfirmationToken,
  StripeAddressElementChangeEvent,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Review from "./Review";
import type { Address } from "../../app/models/user";
import {
  useFetchUserAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountsApi";
import { useBasket } from "../../lib/hooks/useBasket";

const steps = ["Address", "Payment", "Review"];

const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

export default function CheckoutStepper() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [activeStep, setActiveStep] = useState(0);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 금액/장바구니/클라이언트 시크릿
  const { basket, total, clearBasket } = useBasket(); // basket?.clientSecret 필요!

  // 주소 불러오기(Stripe defaultValues 타이밍을 위해)
  const { data: addressData, isLoading: isLoadingAddress } = useFetchUserAddressQuery();
  const [updateAddress] = useUpdateUserAddressMutation();

  // AddressElement 변경
  const handleAddressChange = (e: StripeAddressElementChangeEvent) =>
    setAddressComplete(!!e?.complete);

  // PaymentElement 변경
  const handlePaymentChange = (e: StripePaymentElementChangeEvent) =>
    setPaymentComplete(!!e?.complete);

  // Stripe AddressElement 값 -> 서버 Address 타입으로 변환
  const getStripeAddress = async (): Promise<Address | null> => {
    const addrEl = elements?.getElement(AddressElement);
    if (!addrEl) return null;

    const { value } = await addrEl.getValue();
    const { name, address } = value || {};
    if (!name || !address) return null;

    return {
      name: name as string,
      line1: address.line1 as string,
      line2: address.line2 ?? undefined, // null → undefined
      city: address.city as string,
      state: address.state as string,
      postal_code: address.postal_code as string,
      country: address.country as string,
    };
  };

  // 결제 확정(리뷰 단계에서 실행)
  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      if (!stripe || !elements) throw new Error("Stripe is not ready.");
      if (!confirmationToken) throw new Error("Missing confirmation token.");
      if (!basket?.clientSecret) throw new Error("Missing client secret.");

      const result = await stripe.confirmPayment({
        clientSecret: basket.clientSecret,            // ✅ 정확한 속성명
        redirect: "if_required",
        confirmParams: {
          confirmation_token: confirmationToken.id,  // ✅ 방금 만든 토큰으로 확정
        },
      });

      // 성공 처리
      if (result.paymentIntent?.status === "succeeded") {
        navigate("/checkout/success");
        clearBasket();
        return;
      }

      // 에러 처리
      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      // 그 외 알 수 없는 상태
      throw new Error("Something went wrong confirming the payment.");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      // 결제 실패 시 결제 단계로 한 스텝 뒤로
      setActiveStep((s) => Math.max(s - 1, 0));
    } finally {
      setSubmitting(false);
    }
  };

  // Next 버튼 핸들러
  const handleNext = async () => {
    // Step 0: 주소 저장 체크 시 서버 반영
    if (activeStep === 0 && saveAsDefault && elements) {
      const addr = await getStripeAddress();
      if (addr) await updateAddress(addr);
    }

    // Step 1: 결제 단계에서 토큰 생성 (버튼 활성화 조건 이미 paymentComplete)
    if (activeStep === 1) {
      if (!elements || !stripe) return;
      const res = await elements.submit();
      if (res.error) {
        toast.error(res.error.message || "Payment form is invalid.");
        return;
      }
      const tokenRes = await stripe.createConfirmationToken({ elements });
      if (tokenRes.error) {
        toast.error(tokenRes.error.message || "Failed to create confirmation token.");
        return;
      }
      setConfirmationToken(tokenRes.confirmationToken ?? null);
    }

    // Step 2: 리뷰 단계에서 결제 확정
    if (activeStep === 2) {
      await confirmPayment();
      return; // confirmPayment 내에서 성공 시 네비게이트
    }

    if(activeStep < 2) setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  if (isLoadingAddress) {
    return (
      <>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6">Loading address…</Typography>
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
          <Button variant="outlined" disabled>Back</Button>
          <Button variant="contained" disabled>Next</Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, idx) => (
            <Step key={idx}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          {/* Address */}
          <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
            <Typography variant="h6" gutterBottom>Shipping address</Typography>
            <AddressElement
              options={{
                mode: "shipping",
                defaultValues: addressData
                  ? {
                      name: addressData.name,
                      address: {
                        line1: addressData.line1,
                        line2: addressData.line2 ?? undefined,
                        city: addressData.city,
                        state: addressData.state,
                        postal_code: addressData.postal_code,
                        country: addressData.country,
                      },
                    }
                  : undefined,
              }}
              onChange={handleAddressChange}
            />
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                  />
                }
                label="Save as default address"
              />
            </Box>
          </Box>

          {/* Payment */}
          <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
            <Typography variant="h6" gutterBottom>Payment</Typography>
            <PaymentElement 
              onChange={handlePaymentChange} 
                options={{
                  wallets :{
                    applePay: "never",
                    googlePay: "never",
                    
                  }
                 }}
            />
          </Box>

          {/* Review */}
          <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
            <Typography variant="h6" gutterBottom>Review your order</Typography>
            <Review confirmationToken={confirmationToken} />
          </Box>
        </Box>
      </Paper>

      {/* 하단 네비게이션 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
        <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0 || submitting}>
          Back
        </Button>
        <LoadingButton
          loading={submitting}
          variant="contained"
          onClick={handleNext}
          disabled={
            submitting ||
            (activeStep === 0 && !addressComplete) ||
            (activeStep === 1 && !paymentComplete)
          }
        >
          {activeStep === steps.length - 1
            ? `Pay ${formatCurrency(total)}`
            : "Next"}
        </LoadingButton>
      </Box>
    </>
  );
}