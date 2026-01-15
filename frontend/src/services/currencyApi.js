// src/services/currencyApi.js
import { apiSlice } from './apiSlice.js';

export const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLatestRates: builder.query({
      query: (base = 'USD') => ({
        // Gunakan URL absolut
        url: `https://open.er-api.com/v6/latest/${base}`,
        method: 'GET',
        // Tambahkan flag custom agar interceptor tidak mengirim Token JWT
        isExternal: true, 
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetLatestRatesQuery } = currencyApi;