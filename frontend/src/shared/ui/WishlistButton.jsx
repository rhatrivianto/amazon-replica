import { Heart } from 'lucide-react';
import { useGetMyWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../services/wishlistApi';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const WishlistButton = ({ productId, size = 20 }) => {
  const userInfo = useSelector(selectUserInfo);
  
  // Skip query jika user belum login agar tidak error 401 di console
  const { data: wishlistData } = useGetMyWishlistQuery(undefined, { skip: !userInfo });
  
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  const wishlist = wishlistData?.data || [];
  
  // Cek apakah produk ini ada di wishlist (handle jika wishlist berisi ID string atau object populated)
  const isInWishlist = wishlist.some(item => 
    (typeof item === 'string' ? item : item._id) === productId
  );

  const handleToggle = async (e) => {
    e.preventDefault(); // Mencegah link produk terklik jika tombol ini ada di dalam kartu produk
    e.stopPropagation();

    if (!userInfo) {
      toast.error("Please login to use wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.data?.message || "Failed to update wishlist");
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isAdding || isRemoving}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors z-10 relative ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}
      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart size={size} fill={isInWishlist ? "currentColor" : "none"} />
    </button>
  );
};

export default WishlistButton;
