import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Digunakan oleh Controller untuk ambil data ke Stripe
export const prepareOrderData = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');
  return cart.items; 
};

// DIPANGGIL OLEH WEBHOOK (Amazon Style)
// Stok baru berkurang setelah uang masuk
export const finalizeOrder = async (userId, session) => {
  // 1. IDEMPOTENCY CHECK (Cek Duplikasi)
  // Jika webhook sudah jalan duluan, order mungkin sudah ada.
  const existingOrder = await Order.findOne({ stripeSessionId: session.id });
  if (existingOrder) return existingOrder;

  // 2. Ambil Keranjang
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null; // Keranjang kosong & Order belum ada (Safety check)

  // 3. Cek & Kurangi Stok
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  // 2. Buat Pesanan dengan status "Paid"
  const order = await Order.create({
    user: userId,
    items: cart.items,
    totalPrice: cart.totalPrice,
    paymentStatus: 'paid',
    paymentMethod: 'Stripe',
    stripeSessionId: session.id,
    shippingAddress: session.shipping_details?.address || 'Address from Stripe'
  });

  // 3. Kosongkan Keranjang
  await Cart.findOneAndDelete({ user: userId });

  return order;
};

export const getMyOrders = async (userId) => {
  return await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });
};
