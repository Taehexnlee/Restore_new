import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api/baseApi";
import { Item, type Basket } from "../models/basket";
import type { Product } from "../models/product";
import Cookies from "js-cookie";

function isBasketItem(product: Product | Item): product is Item {
  return (product as Item).quantity !== undefined;
}

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket, void>({
      query: () => "basket",
      providesTags: ["Basket"],
    }),

    addBasketItem: builder.mutation<Basket, { product: Product | Item; quantity: number }>({
      query: ({ product, quantity }) => {
        const productId = isBasketItem(product) ? product.productId : product.id;
        return {
          url: `basket?productId=${productId}&quantity=${quantity}`,
          method: "POST",
        };
      },
      onQueryStarted: async ({ product, quantity }, { dispatch, queryFulfilled }) => {
        let isNewBasket = false;
        let patchResult: { undo: () => void } | undefined;

        try {
          patchResult = dispatch(
            basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
              // 캐시에 아직 basket이 없을 수 있음 (없으면 updateQueryData 자체가 throw 될 수 있음)
              const productId = isBasketItem(product) ? product.productId : product.id;

              if (!draft.basketId) {
                isNewBasket = true;
                return; // 새로운 바스켓은 응답으로 갱신
              }

              const existing = draft.items.find((i) => i.productId === productId);
              if (existing) {
                existing.quantity += quantity;
              } else {
                draft.items.push(
                  isBasketItem(product)
                    ? product
                    : { ...product, productId: product.id, quantity }
                );
              }
            })
          );
        } catch {
          // 캐시가 없어서 updateQueryData가 실패한 경우
          isNewBasket = true;
        }

        try {
          await queryFulfilled;
          if (isNewBasket) dispatch(basketApi.util.invalidateTags(["Basket"]));
        } catch {
          patchResult?.undo?.();
        }
      },
    }),

    removeBasketItem: builder.mutation<void, { productId: number; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "DELETE",
      }),
      onQueryStarted: async ({ productId, quantity }, { dispatch, queryFulfilled }) => {
        let patchResult: { undo: () => void } | undefined;
        try {
          patchResult = dispatch(
            basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
              const idx = draft.items.findIndex((i) => i.productId === productId);
              if (idx >= 0) {
                draft.items[idx].quantity -= quantity;
                if (draft.items[idx].quantity <= 0) {
                  draft.items.splice(idx, 1);
                }
              }
            })
          );
        } catch {
          // 캐시가 아직 없을 수 있음: 낙관적 업데이트 생략
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult?.undo?.();
        }
      },
    }),

    clearBasket: builder.mutation<void, void>({
      // 서버 호출 없이 캐시/쿠키만 정리
      queryFn: async () => ({ data: undefined }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(
            basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
              draft.items = [];
              draft.basketId = "";
              // (draft as any).clientSecret = "";
            })
          );
        } catch {
          // 캐시 미존재 시 무시
        }
        Cookies.remove("basketId");
      },
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useClearBasketMutation,
} = basketApi;
