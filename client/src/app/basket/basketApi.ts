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
            providesTags: ["Basket"]
        }),
        addBasketItem: builder.mutation<Basket, { product: Product| Item; quantity: number }>({
            query: ({ product, quantity }) => {
                const productId = isBasketItem(product) ? product.productId : product.id;
                return {
                    url:`basket?productId=${productId}&quantity=${quantity}`,
                    method: "POST" 
                }
            },
            onQueryStarted: async ({product, quantity}, {dispatch, queryFulfilled}) => {
                let isNewBasket = false;
                const patchResult = dispatch(
                    basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
                        const productId = isBasketItem(product) ? product.productId : product.id;

                        if(!draft.basketId) isNewBasket = true;
                           

                        if(!isNewBasket)
                        {   
                            const existingItem = draft.items.find(i => i.productId === productId);
                            if (existingItem) {
                                existingItem.quantity += quantity;
                            }else draft.items.push(isBasketItem(product)? product : {...product, productId: product.id, quantity});
                        }
                    }
                    )
                );
                try {
                    await queryFulfilled;
                    if(isNewBasket) dispatch(basketApi.util.invalidateTags(["Basket"]));
                }catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            },
        }),
        removeBasketItem: builder.mutation<void, { productId: number; quantity: number }>({
            query: ({ productId, quantity }) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: "DELETE"
            }),
            onQueryStarted: async ({productId, quantity}, {dispatch, queryFulfilled}) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
                        const itemIndex = draft.items.findIndex(i => i.productId === productId);
                        if(itemIndex >= 0) {
                            draft.items[itemIndex].quantity -= quantity;
                            if(draft.items[itemIndex].quantity <=0) {
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    }
                    )
                );
                try {
                    await queryFulfilled;
                }catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            },
        }),
        clearBasket: builder.mutation<void, void>({
            // API 호출 없이 RTKQ 캐시만 조작할 때는 queryFn 사용
            queryFn: async () => ({ data: undefined }),
            async onQueryStarted(_, { dispatch }) {
              // 1) RTK Query 캐시의 fetchBasket 데이터 비우기
              dispatch(
                basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
                  if (draft) draft.items = [];
                })
              );
              // 2) 브라우저 basketId 쿠키 제거
              Cookies.remove("basketId");
            },
          }),
    })
})

export const {useFetchBasketQuery, useAddBasketItemMutation, useRemoveBasketItemMutation, useClearBasketMutation} = basketApi;
            