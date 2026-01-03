import { apiSlice } from './apiSlice.js';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Mengambil data keranjang belanja
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    // 2. Menambah produk ke keranjang (PENTING untuk ProductGrid)
    addToCart: builder.mutation({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body, // Isinya: { productId, quantity }
      }),
      // 'Cart' di-invalidate agar jumlah di navbar/cart page terupdate otomatis
      invalidatesTags: ['Cart'],
    }),

    // 3. Update jumlah barang (Qty)
    updateQuantity: builder.mutation({
      query: (body) => ({ 
        url: '/cart/update-quantity', 
        method: 'PATCH', 
        body 
      }),
      invalidatesTags: ['Cart'],
    }),

    // 4. Menghapus satu item dari keranjang
    removeFromCart: builder.mutation({
      query: (productId) => ({ 
        url: `/cart/${productId}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

// Export Hook baru: useAddToCartMutation
export const { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useUpdateQuantityMutation, 
  useRemoveFromCartMutation 
} = cartApi;