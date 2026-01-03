
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice.js'; 
import { toast } from 'react-hot-toast';

import { useGetProductsQuery } from '../../../services/adminServiceApi.js';
import { useAddToCartMutation } from '../../../services/cartApi.js';
import ProductCard from './ProductCard.jsx';

const ProductGrid = ({ onOpenAuth, categoryId }) => {
  const userInfo = useSelector(selectUserInfo);
  
  // 1. Fetch data dari Backend (Mengirim categoryId sebagai filter jika ada)
  const { data: response, isLoading, error } = useGetProductsQuery({ category: categoryId });
  
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

  if (isLoading) return <div className="p-10 text-center text-gray-500">Memuat produk Amazon...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Gagal mengambil data produk</div>;

  const products = response?.data || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onAddToCart={(p, e) => handleAddToCart(p, e)} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;