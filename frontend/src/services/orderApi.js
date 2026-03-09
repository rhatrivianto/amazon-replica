import { apiSlice } from './apiSlice.js';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: '/orders/checkout-session',
        method: 'POST',
        body,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: '/orders/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'], // Otomatis refresh data keranjang setelah verifikasi
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} = orderApi;