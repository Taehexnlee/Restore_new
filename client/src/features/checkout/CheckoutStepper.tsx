import { useState } from "react";
import {
  Paper, Stepper, Step, StepLabel, Box, Button,
  Typography, FormControlLabel, Checkbox,
} from "@mui/material";
import {
  AddressElement, PaymentElement, useElements, useStripe,
} from "@stripe/react-stripe-js";
import type {
  ConfirmationToken,
  StripeAddressElementChangeEvent,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { toast } from "react-toastify";

import Review from "./Review";
import type { Address } from "../../app/models/user";
import type { CreateOrder, Order } from "../../app/models/order";
import { useBasket } from "../../lib/hooks/useBasket";
import {
  useFetchUserAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountsApi";
import { useCreateOrderMutation } from "../orders/ordersApi";

const steps = ["Address", "Payment", "Review"];

const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  // no direct navigation; Stripe handles redirect via return_url

  const { total, basket } = useBasket();

  const { data: addressData, isLoading: isLoadingAddress } =
    useFetchUserAddressQuery();
  const [updateAddress] = useUpdateUserAddressMutation();

  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);
  const [createOrder] = useCreateOrderMutation();

  // Preserve order snapshot for the review/success views if needed
  const [, setOrderForReview] = useState<Order | null>(null);

  const handleAddressChange = (e: StripeAddressElementChangeEvent) => {
    setAddressComplete(!!e?.complete);
  };

  const handlePaymentChange = (e: StripePaymentElementChangeEvent) => {
    setPaymentComplete(!!e?.complete);
  };

  // Convert Stripe AddressElement data into the API Address shape
  const getStripeAddress = async (): Promise<Address | null> => {
    const addrEl = elements?.getElement(AddressElement);
    if (!addrEl) return null;

    const { value } = await addrEl.getValue();
    const { name, address } = value || {};
    if (!name || !address) return null;

    return {
      name: name as string,
      line1: address.line1 as string,
      line2: address.line2 ?? undefined, // null -> undefined
      city: address.city as string,
      state: address.state as string,
      postal_code: address.postal_code as string,
      country: address.country as string,
    };
  };

  // Build CreateOrder payload using shipping address and card summary
  const buildCreateOrder = async (token: ConfirmationToken): Promise<CreateOrder> => {
    const shippingAddress = await getStripeAddress();
    const card = token?.payment_method_preview?.card;

    if (!shippingAddress || !card) {
      throw new Error("Problem creating order payload.");
    }

    return {
      shippingAddress,
      paymentSummary: {
        last4: Number(card.last4 ?? 0), // Server expects a number; Stripe returns a string
        brand: card.brand ?? "",
        expMonth: card.exp_month ?? 0,
        expYear: card.exp_year ?? 0,
      },
    };
  };

  // Finalize payment during the review step using clientSecret and confirmation token
  const confirmPayment = async () => {
    if (!stripe) throw new Error("Stripe not ready");
    if (!confirmationToken?.id) throw new Error("Missing confirmation token");
    if (!basket?.clientSecret) throw new Error("Missing client secret");

    // Do not pass elements/redirect options when a clientSecret is supplied (redirect defaults to 'always')
    await stripe.confirmPayment({
      clientSecret: basket.clientSecret, // Must be present
      confirmParams: {
        confirmation_token: confirmationToken.id,
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    // Stripe usually redirects immediately, so code below may not run
  };

  const handleNext = async () => {
    try {
      // Step 0: Optionally persist address when the toggle is enabled
      if (activeStep === 0 && saveAsDefault && elements) {
        const addr = await getStripeAddress();
        if (addr) await updateAddress(addr);
      }

      // Step 1: Validate payment details, create confirmation token, pre-create order
      if (activeStep === 1) {
        if (!elements || !stripe) return;
      
        const submitRes = await elements.submit();
        if (submitRes.error) {
          toast.error(submitRes.error.message);
          return;
        }
      
        const tokenRes = await stripe.createConfirmationToken({ elements });
        if (tokenRes.error || !tokenRes.confirmationToken) {
          toast.error(tokenRes.error?.message || "Failed to create token");
          return;
        }
        const ct = tokenRes.confirmationToken;
        setConfirmationToken(ct);

        // Create a pending order ahead of the actual confirmation
        const payload = await buildCreateOrder(ct);
        const created = await createOrder(payload).unwrap();

        // Cache the order so the success page can recover it
        localStorage.setItem("checkout:pendingOrder", JSON.stringify(created));
      
        setOrderForReview(created);
        setActiveStep(2);
        return;
      }
      
      // Step 2: Stripe processes payment and handles the return_url redirect
      if (activeStep === 2) {
        await confirmPayment();
        return; // Redirect occurs, nothing else to do locally
      }

      // Default step progression
      if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      // If payment failed, return to the payment step
      if (activeStep === 2) setActiveStep(1);
    }
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
                defaultValues: addressData ? {
                  name: addressData.name,
                  address: {
                    line1: addressData.line1,
                    line2: addressData.line2 ?? undefined,
                    city: addressData.city,
                    state: addressData.state,
                    postal_code: addressData.postal_code,
                    country: addressData.country,
                  },
                } : undefined,
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
            <PaymentElement onChange={handlePaymentChange} />
          </Box>

          {/* Review */}
          <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
            <Typography variant="h6" gutterBottom>Review your order</Typography>
            <Review confirmationToken={confirmationToken} />
            {/* Optional: <Review confirmationToken={confirmationToken} order={orderForReview}/> */}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
        <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !addressComplete) ||
            (activeStep === 1 && !paymentComplete)
          }
        >
          {activeStep === steps.length - 1 ? `Pay ${formatCurrency(total)}` : "Next"}
        </Button>
      </Box>
    </>
  );
}
