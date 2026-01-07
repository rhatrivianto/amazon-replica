import { apiSlice } from './apiSlice.js';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: () => ({
    // Endpoint dipindahkan ke orderApi.js untuk menghindari konflik dan error import
  }),
});