import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('items.product');
};

export const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Produk tidak ditemukan');
  if (product.stock < quantity) throw new Error('Stok tidak mencukupi');

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price: product.price }]
    });
  } else {
    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }
    await cart.save();
  }
  return cart;
};

export const updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
  
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
  }
  return cart;
};

export const removeFromCart = async (userId, productId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true }
  );
};