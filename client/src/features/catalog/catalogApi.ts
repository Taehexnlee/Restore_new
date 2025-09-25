// src/features/catalog/catalogApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi"; // Custom base query with error handling
import type { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import type { Pagination } from "../../app/models/pagination";

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithErrorHandling,   // Use shared base query implementation
  endpoints: (builder) => ({
    fetchProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({
      query: (productParams) => { 
        return {
          url: 'products' ,
          params: filterEmptyValues(productParams)
        }
          
        },
        transformResponse: (items: Product[], meta) => {
          const paginationHeader = meta?.response?.headers.get("Pagination");
          const pagination= paginationHeader ? JSON.parse(paginationHeader) : null;
          return { items, pagination };
        }
      
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (id) => ({ url: `products/${id}` }),
    }),
    fetchfilters: builder.query<{ brands: string[]; types: string[] }, void>({
      query: () => ({ url: 'products/filters' }),
    })
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchfiltersQuery
} = catalogApi;
