import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice.js'; 
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useGetProductsQuery } from '../../../services/adminServiceApi.js';
import { useAddToCartMutation } from '../../../services/cartApi.js';
import ProductCard from './ProductCard.jsx';
import Pagination from '../../../shared/ui/Pagination.jsx';

const ProductGrid = ({ onOpenAuth, categoryId, searchQuery }) => {
  const userInfo = useSelector(selectUserInfo);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(''); // State untuk sorting

  // Reset ke halaman 1 jika kategori berubah
  useEffect(() => {
    setPage(1);
  }, [categoryId]);
  
  const limit = 12; // Kita simpan limit dalam variabel agar bisa dipakai untuk hitungan
  // 1. Persiapkan parameter query yang bersih (hapus null/undefined)
  const queryParams = {
    page,
    limit,
    sortBy, // Kirim parameter sort ke Backend
  };
  
  // Hanya tambahkan category jika ada nilainya (bukan null/undefined)
  if (categoryId) queryParams.category = categoryId;
  // Hanya tambahkan search query jika ada
  if (searchQuery) queryParams.q = searchQuery;

  const { data: response, isLoading, error, isFetching } = useGetProductsQuery(queryParams);
  
  // 2. Persiapkan fungsi Add to Cart dari API
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (product, e) => {
    if (e && e.stopPropagation) e.stopPropagation(); // Mencegah klik mengarah ke halaman detail jika event tersedia

    if (!userInfo) {
      toast.error(`Silakan login untuk membeli: ${product.name}`, {
        icon: '🔒',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      onOpenAuth(); // Buka modal login
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
    } catch (err) {
      toast.error(err.data?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin text-[#e47911]" size={40} />
      <p className="text-gray-500 mt-4 text-sm">Memuat produk Amazon...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
      <p className="font-bold">Gagal mengambil data produk</p>
      <p className="text-sm mt-1">{error?.data?.message || error?.error || 'Terjadi kesalahan jaringan'}</p>
    </div>
  );

  const products = response?.data || [];
  const pagination = response?.pagination || {};

  // Hitung range produk (Start - End)
  const totalItems = pagination.total || 0;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="space-y-8 p-4">
      {/* Header Info & Sorting */}
      {!isLoading && !error && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600 shadow-sm bg-white p-3 rounded border border-gray-100">
          <div>
            Showing <span className="font-bold text-black">{startItem}-{endItem}</span> of <span className="font-bold text-black">{totalItems}</span> results
          </div>
          
          {/* Dropdown Sortir ala Amazon */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="hidden sm:inline">Sort by:</label>
            <select 
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-md py-1 px-2 text-xs sm:text-sm shadow-sm focus:ring-1 focus:ring-[#e47911] outline-none cursor-pointer"
            >
              <option value="">Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-createdAt">Newest Arrivals</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onAddToCart={(p, e) => handleAddToCart(p, e)} 
          />
        ))}
      </div>

      {/* Indikator Loading Kecil saat ganti halaman */}
      {isFetching && !isLoading && (
        <div className="flex justify-center text-xs text-[#e47911] items-center gap-2">
          <Loader2 className="animate-spin" size={12} /> Memperbarui hasil...
        </div>
      )}

      <Pagination 
        currentPage={page}
        totalPages={pagination.pages || 1}
        onPageChange={(newPage) => {
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default ProductGrid;