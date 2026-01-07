import { useCallback } from 'react';
import { useParams, useOutletContext, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../features/auth/authSlice.js';
import { Info, MessageSquare, ThumbsUp, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection.jsx';
import PriceTag from '../components/PriceTag.jsx';
import ProductRating from '../components/ProductRating.jsx';
import ProductRecommendations from '../components/ProductRecommendations.jsx';
import { useAddToCartMutation } from '../../../services/cartApi.js';
import { useGetProductByIdQuery } from '../../../services/adminServiceApi.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const { openAuthModal } = useOutletContext();
  const { data: prodData, isLoading } = useGetProductByIdQuery(id);
  
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const product = prodData?.data;

  const handleAddToCart = useCallback(async () => {
    // Langkah A: Cek jika user belum login
    if (!userInfo) {
      openAuthModal();
      return;
    }

    // Langkah B: Jika sudah login, tambahkan ke keranjang
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
    } catch (err) {
      toast.error(err.data?.message || 'Gagal menambahkan produk.');
    }
  }, [userInfo, openAuthModal, addToCart, product]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-[#e47911]" size={40} />
    </div>
  );

  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <>
      <div className="relative bg-white min-h-screen pb-20">
        <div className="max-w-[1500px] mx-auto px-4 lg:px-8 pt-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-[#e47911] mb-4 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* --- KOMPONEN BREADCRUMB --- */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            {product?.breadcrumbs && product.breadcrumbs.map((cat, index) => (
              <span key={cat._id} className="flex items-center">
                {/* Tampilkan separator '>' kecuali untuk item pertama */}
                {index > 0 && <span className="mx-2 text-gray-400">›</span>}
                
                <Link 
                  to={`/?category=${cat._id}`} 
                  className="hover:text-yellow-600 hover:underline transition-colors"
                >
                  {cat.name}
                </Link>
              </span>
            ))}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Kolom 1: Image */}
          <div className="md:col-span-5 flex justify-center border-r border-gray-100 p-4">
            <img 
              src={product.images?.[0]} 
              alt={product.name} 
              className="max-h-[500px] object-contain sticky top-24"
            />
          </div>

          {/* Kolom 2: Basic Detail */}
          <div className="md:col-span-4 space-y-4">
            <h1 className="text-2xl font-medium leading-tight">{product.name}</h1>
            <div className="border-b pb-4">
              <ProductRating rating={product.rating} reviewsCount={product.numReviews} />
            </div>
            <div className="py-2">
              <PriceTag price={product.price} />
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Kolom 3: Add to Cart Box */}
          <div className="md:col-span-3">
            <div className="border border-gray-300 rounded-lg p-4 sticky top-24 bg-white shadow-sm">
              <PriceTag price={product.price} />
              <p className="text-[#007600] text-sm font-medium mt-2">In Stock</p>
              
            <button 
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2 rounded-full shadow-sm text-sm font-bold mt-4 cursor-pointer relative z-10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button 
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#ffa41c] hover:bg-[#fa8914] py-2 rounded-full shadow-sm text-sm font-bold mt-2 cursor-pointer"
            >
              Buy Now
            </button>
            </div>
          </div>
          </div>
        </div>

        {/* Technical & Insights Section */}
        <div className="max-w-[1500px] mx-auto px-4 lg:px-8 mt-12 pt-10 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-bold text-md border-b pb-2 flex items-center gap-2">
                <Info size={18} className="text-gray-400" /> Technical Details
              </h3>
              <table className="w-full text-sm mt-4 border-collapse">
                <tbody>
                  {product.specifications?.length > 0 ? (
                    product.specifications.map((spec, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 font-bold w-1/3 bg-gray-50 px-2">{spec.key}</td>
                        <td className="py-2 px-2">{spec.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b">
                      <td className="py-2 text-gray-500 italic">No technical details available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-bold text-md border-b pb-2 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-400" /> Customer Insights
              </h3>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp size={16} className="text-[#007185]" />
                  <span className="text-sm font-bold">Highly Rated by Customers</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Lower return rate compared to similar products in the category.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-200">
            <ProductRecommendations 
              currentCategoryId={product.category?._id} 
              currentProductId={product._id} 
            />
            <ReviewSection 
              productId={product._id} 
              productRating={product.rating} 
              numReviews={product.numReviews} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;