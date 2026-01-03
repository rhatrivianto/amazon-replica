// src/services/currencyApi.js
import { apiSlice } from './apiSlice.js';

export const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLatestRates: builder.query({
      // Menggunakan URL absolut untuk API eksternal
      query: (base = 'USD') => ({
        url: `https://open.er-api.com/v6/latest/${base}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetLatestRatesQuery } = currencyApi;