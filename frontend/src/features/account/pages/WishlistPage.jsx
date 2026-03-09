import { Link } from 'react-router-dom';
import { useGetMyWishlistQuery, useRemoveFromWishlistMutation } from '../../../services/wishlistApi';
import { useAddToCartMutation } from '../../../services/cartApi';
import { Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PriceTag from '../../products/components/PriceTag';

const WishlistPage = () => {
  const { data: wishlistData, isLoading } = useGetMyWishlistQuery();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const wishlist = wishlistData?.data || [];

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err,'Failed to remove item');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err,'Failed to add to cart');
    }
    
  };

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /> Loading wishlist...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-normal mb-6 border-b pb-2">Your Wish List</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-blue-600 hover:underline">Explore products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              {/* Gambar */}
              <div className="w-full sm:w-48 h-48 flex-shrink-0 bg-white flex items-center justify-center p-2">
                <img 
                  src={product.images?.[0]} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Detail */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product._id}`} className="text-lg font-medium text-blue-600 hover:underline hover:text-[#c45500] line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="mt-2">
                    <PriceTag price={product.price} />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdding || product.stock === 0}
                    className="flex items-center gap-1 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-3 py-1.5 text-sm shadow-sm font-medium disabled:opacity-50"
                  >
                    <ShoppingCart size={16} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => handleRemove(product._id)}
                    disabled={isRemoving}
                    className="flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm font-medium text-gray-700"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
