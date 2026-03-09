import * as wishlistService from '../services/wishlist.service.js';
import AppError from '../utils/AppError.js';

export const getMyWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.status(200).json({
      status: 'success',
      results: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const addProductToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }
    await wishlistService.addToWishlist(req.user.id, productId);
    res.status(200).json({
      status: 'success',
      message: 'Product added to wishlist',
    });
  } catch (error) {
    next(error);
  }
};

export const removeProductFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await wishlistService.removeFromWishlist(req.user.id, productId);
    res.status(200).json({
      status: 'success',
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    next(error);
  }
};