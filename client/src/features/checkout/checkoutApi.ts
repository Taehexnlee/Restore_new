// src/features/checkout/checkoutApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Basket } from "../../app/models/basket";
import { basketApi } from "../../app/basket/basketApi";

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => ({
        url: "payments",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // ✅ Basket 캐시 업데이트 (clientSecret 반영)
          dispatch(
            basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
              draft.clientSecret = data.clientSecret;
            })
          );
        } catch (err) {
          console.error("Payment intent creation failed:", err);
        }
      },
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = checkoutApi;