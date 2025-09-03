// src/features/catalog/catalogApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi"; // ✅ 커스텀 쿼리

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling,   // ✅ 교체
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], void>({
      query: () => ({ url: 'products' }),
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (id) => ({ url: `products/${id}` }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
} = catalogApi;