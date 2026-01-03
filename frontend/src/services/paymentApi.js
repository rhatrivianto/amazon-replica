import { apiSlice } from './apiSlice.js';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mengambil URL Stripe Checkout
    createCheckoutSession: builder.mutation({
      query: (items) => ({
        url: '/orders/checkout', // Sesuai rute backend kamu
        method: 'POST',
        body: { items },
      }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = paymentApi;