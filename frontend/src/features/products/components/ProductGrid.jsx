import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice.js'; 
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useGetProductsQuery } from '../../../services/adminServiceApi.js';
import { useAddToCartMutation } from '../../../services/cartApi.js';
import ProductCard from './ProductCard.jsx';
import Pagination from '../../../shared/ui/Pagination.jsx';

const ProductGrid = ({ onOpenAuth, categoryId }) => {
  const userInfo = useSelector(selectUserInfo);
  const [page, setPage] = useState(1);

  // Reset ke halaman 1 jika kategori berubah
  useEffect(() => {
    setPage(1);
  }, [categoryId]);
  
  // 1. Fetch data dengan parameter page & limit
  const { data: response, isLoading, error, isFetching } = useGetProductsQuery({ 
    category: categoryId,
    page: page,
    limit: 12 
  });
  
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

  if (error) return <div className="p-10 text-center text-red-500">Gagal mengambil data produk</div>;

  const products = response?.data || [];
  const pagination = response?.pagination || {};

  return (
    <div className="space-y-8 p-4">
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