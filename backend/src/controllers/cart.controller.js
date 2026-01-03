import * as cartService from '../services/cart.service.js';

export const getMyCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ status: 'success', data: cart || { items: [] } });
  } catch (error) { next(error); }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user.id, productId, quantity || 1);
    res.status(200).json({ status: 'success', data: cart });
  } catch (error) { next(error); }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateQuantity(req.user.id, productId, quantity);
    res.status(200).json({ status: 'success', data: cart });
  } catch (error) { next(error); }
};

export const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
    res.status(200).json({ status: 'success', data: cart });
  } catch (error) { next(error); }
};