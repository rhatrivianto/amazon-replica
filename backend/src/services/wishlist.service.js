// backend/src/services/wishlist.service.js
import User from '../models/user.model.js';

export const toggleWishlistInDb = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User tidak ditemukan');

  const isWishlisted = user.wishlist.includes(productId);

  if (isWishlisted) {
    // Hapus dari wishlist
    user.wishlist.pull(productId);
  } else {
    // Tambah ke wishlist
    user.wishlist.addToSet(productId);
  }

  await user.save();
  return isWishlisted; // Mengembalikan status lama untuk pesan response
};