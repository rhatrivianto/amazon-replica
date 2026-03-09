import User from '../models/user.model.js';

export const getWishlist = async (userId) => {
  const user = await User.findById(userId)
    .populate('wishlist', 'name price images slug stock ratingsAverage numReviews') // Populate field penting
    .select('wishlist');
    
  return user ? user.wishlist : [];
};

export const addToWishlist = async (userId, productId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } }, // $addToSet mencegah duplikasi item
    { new: true }
  );
};

export const removeFromWishlist = async (userId, productId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true }
  );
};