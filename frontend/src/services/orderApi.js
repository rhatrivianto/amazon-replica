import { apiSlice } from './apiSlice.js';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Membuat sesi pembayaran Stripe
    createCheckoutSession: builder.mutation({
      query: (items) => ({
        url: '/orders/checkout',
        method: 'POST',
        body: { items },
      }),
    }),
    // Mengambil riwayat pesanan (opsional untuk nanti)
    getMyOrders: builder.query({
      query: () => '/orders/myorders',
      providesTags: ['Order'],
    }),
  }),
});

export const { 
  useCreateCheckoutSessionMutation,
  useGetMyOrdersQuery 
} = orderApi;