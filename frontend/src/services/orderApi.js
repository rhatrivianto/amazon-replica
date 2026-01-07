import { apiSlice } from './apiSlice.js';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mengambil riwayat pesanan user yang sedang login
    getMyOrders: builder.query({
      query: () => '/orders/my-orders', // Koreksi: Tambahkan hyphen agar sesuai route backend
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
  }),
});

export const { useGetMyOrdersQuery, useCreateOrderMutation, useGetOrderByIdQuery } = orderApi;
