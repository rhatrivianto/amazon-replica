import { useGetAdminProductsQuery } from '../../../services/adminServiceApi.js';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';

const ProductRecommendations = ({ currentCategoryId, currentProductId }) => {
  const { data } = useGetAdminProductsQuery();
  
  // Cari produk di kategori yang sama tapi bukan produk yang sedang dibuka
  const recommended = data?.data
    ?.filter(p => p.category?._id === currentCategoryId && p._id !== currentProductId)
    .slice(0, 5) || [];

  if (recommended.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-bold mb-4 text-[#c45500]">Customers who bought this item also bought</h3>
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {recommended.map(product => (
          <Link 
            key={product._id} 
            to={`/product/${product._id}`}
            className="min-w-[160px] max-w-[160px] group"
          >
            <div className="h-40 flex items-center justify-center bg-gray-50 rounded-sm mb-2">
              <img src={product.images?.[0]} alt={product.name} className="max-h-32 object-contain" />
            </div>
            <h4 className="text-xs text-[#007185] group-hover:text-[#c45500] group-hover:underline line-clamp-2 h-8">
              {product.name}
            </h4>
            <div className="mt-1">
              <PriceTag price={product.price} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;