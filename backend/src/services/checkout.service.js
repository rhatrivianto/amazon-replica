import mongoose from 'mongoose';
import * as cartService from './cart.service.js';
import * as orderService from './order.service.js';
import * as productService from './product.service.js';

export const processCheckout = async (userId, paymentMethodId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await cartService.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    // Atomic stock validation & deduction
    for (const item of cart.items) {
      const isUpdated = await productService.updateStockAtomic(item.product._id, -item.quantity);
      if (!isUpdated) throw new Error(`Stock insufficient for: ${item.product.name}`);
    }

    // Create Order within the same transaction
    const order = await orderService.createOrder(userId, {
      items: cart.items,
      total: cart.totalPrice, // Pastikan ada logic total di cart model/service
      paymentStatus: 'pending'
    }, { session });

    await cartService.clearCart(userId, { session });
    
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};