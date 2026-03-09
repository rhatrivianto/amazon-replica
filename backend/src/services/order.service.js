import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { env } from '../config/env.js';

/**
 * Creates an order from a completed Stripe session.
 * This function is idempotent and handles stock reduction.
 * @param {object} session - The Stripe checkout session object.
 * @returns {Promise<Order>} The created or existing order document.
 */
export const createOrderFromStripeSession = async (session) => {
  // 1. Idempotency Check: Prevent duplicate orders from webhook/fallback race conditions.
  const existingOrder = await Order.findOne({ 'paymentDetails.stripeSessionId': session.id });
  if (existingOrder) return existingOrder;

  // 2. Extract data from session
  const shippingAddress = JSON.parse(session.metadata.shippingAddress);
  const cartItems = JSON.parse(session.metadata.cartItems);
  const userId = session.client_reference_id;

  // 3. Reduce stock for each item in the cart
  // In a real-world scenario, this should be a database transaction.
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // 4. Create the new order
  const newOrder = await Order.create({
    user: userId,
    items: cartItems,
    totalPrice: session.amount_total / 100,
    shippingAddress,
    paymentMethod: session.payment_method_types[0],
    paymentStatus: 'paid',
    paymentDetails: {
      stripeSessionId: session.id,
      paymentIntentId: session.payment_intent,
    },
  });

  // 5. Clear the user's cart
  await Cart.findOneAndDelete({ user: userId });

  return newOrder;
};

/**
 * Retrieves all orders for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Order[]>} A list of user's orders.
 */
export const getMyOrders = async (userId, query) => {
  // 1. Pagination Logic
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // 2. Build Query
  const ordersQuery = Order.find({ user: userId })
    .populate('items.product', 'name images price slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // 3. Execute query and count total documents in parallel for efficiency
  const [orders, totalOrders] = await Promise.all([
    ordersQuery,
    Order.countDocuments({ user: userId })
  ]);

  // 4. Return structured data for frontend
  return { orders, totalOrders };
};

/**
 * Retrieves a single order by its ID.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<Order>} The order document.
 */
export const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('items.product');
};

// --- ADMIN SERVICES ---

/**
 * Retrieves all orders from all users, for the admin dashboard.
 * @returns {Promise<Order[]>} A list of all orders.
 */
export const getAllOrders = async () => {
  return await Order.find().populate('user', 'name email').sort('-createdAt');
};

/**
 * Updates the delivery status of an order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new delivery status.
 * @returns {Promise<Order>} The updated order document.
 */
export const updateOrderStatus = async (orderId, status) => {
  // Populate user untuk mendapatkan email dan nama pembeli
  const order = await Order.findById(orderId).populate('user', 'email name');
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const oldStatus = order.deliveryStatus;
  order.deliveryStatus = status;
  await order.save();

  // Kirim Email Notifikasi jika status berubah (misal: Pending -> Shipped)
  if (status !== oldStatus) {
    const message = `Halo ${order.user.name},\n\nStatus pesanan #${order._id} Anda telah diperbarui menjadi: ${status.toUpperCase()}.`;
    
    try {
      await sendEmail({
        email: order.user.email,
        subject: `Update Status Pesanan: ${status.toUpperCase()} - Rully Store`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
            <h2 style="color: #232f3e;">Update Status Pesanan</h2>
            <p>Halo <strong>${order.user.name}</strong>,</p>
            <p>Status pesanan Anda (ID: <strong>${order._id}</strong>) telah diperbarui menjadi:</p>
            <h3 style="color: #e47911; border-bottom: 2px solid #e47911; display: inline-block;">${status.toUpperCase()}</h3>
            <p>Silakan cek detail perjalanan paket Anda di aplikasi.</p>
            <br/>
            <a href="${env.clientUrl}/my-orders" style="background-color: #ffd814; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Lihat Pesanan Saya
            </a>
          </div>
        `
      });
      console.log(`📧 Email notifikasi status '${status}' dikirim ke ${order.user.email}`);
    } catch (error) {
      console.error('❌ Gagal mengirim email notifikasi order:', error.message);
      // Kita tidak throw error agar proses update status di database tetap dianggap sukses
      // meskipun email gagal terkirim (fail-safe).
    }
  }

  return order;
};
