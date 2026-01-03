// Mengacu pada apiSlice pusat di src/app/api/apiSlice.js
import { apiSlice } from "./apiSlice.js"; 

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login', // Konsisten dengan backend Anda
        method: 'POST',
        body: credentials,
      }),
      // Traceable: Simpan token secara otomatis saat login berhasil
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('adminToken', data.token);
        } catch (err) {
          console.error("Trace: Login Admin Gagal", err);
        }
      },
    }),
  }),
});

export const { useAdminLoginMutation } = adminAuthApi;