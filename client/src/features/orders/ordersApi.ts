import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { Order, CreateOrder } from '../../app/models/order';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], void>({
      query: () => ({ url: '/orders', method: 'GET', credentials: 'include' }),
    }),
    fetchOrderDetails: builder.query<Order, number>({
      query: (id) => ({ url: `/orders/${id}`, method: 'GET', credentials: 'include' }),
    }),
    createOrder: builder.mutation<Order, CreateOrder>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useFetchOrdersQuery,
  useFetchOrderDetailsQuery,
  useCreateOrderMutation,
} = ordersApi;