import Stripe from 'stripe';
import * as orderService from '../services/order.service.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const stripe = new Stripe(env.stripeSecretKey);

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress } = req.body;
  const user = req.user;
  const line_items = items.map((item) => ({
      price_data: {
        currency: 'idr',
        product_data: {
          name: item.product.name,
          // FIX: Pastikan images ada dan valid. Stripe butuh array of strings.
          images: item.product.images && item.product.images.length > 0 ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // FIX: Wajib Integer (bulatkan desimal)
      },
      quantity: item.quantity,
    }));
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${env.clientUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/order/cancel`,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(items.map(i => ({ product: i.product._id, quantity: i.quantity }))),
      }
    });
  res.status(200).json({ status: 'success', session });
});

export const stripeWebhook = (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }
  if (event.type === 'checkout.session.completed') {
    // Call the service to handle order creation
    orderService.createOrderFromStripeSession(event.data.object).catch(err => {
      console.error(`[Webhook] Failed to create order: ${err.message}`);
    });
  }
  res.status(200).json({ received: true });
};

export const verifyPaymentSession = asyncHandler(async (req, res, next) => {
  const { session_id } = req.body;
    if (!session_id) {
      return next(new AppError('Session ID is required.', 400));
    }
  const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.client_reference_id !== req.user.id.toString()) {
      return next(new AppError('You are not authorized to verify this payment.', 403));
    }
  if (session.payment_status === 'paid') {
    // The service handles idempotency, so we can just call it.
    await orderService.createOrderFromStripeSession(session);
      res.status(200).json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      return next(new AppError('Payment not successful.', 400));
    }
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  const { orders, totalOrders } = await orderService.getMyOrders(req.user.id, req.query);
  
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  res.status(200).json({ 
    status: 'success', 
    results: orders.length, 
    data: orders,
    pagination: { currentPage: page, totalPages: Math.ceil(totalOrders / limit), totalOrders }
  });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }
  // Authorization check remains in the controller
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view this order', 403));
  }
  res.status(200).json({ status: 'success', data: order });
});

// --- ADMIN CONTROLLERS ---

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ status: 'success', data: order });
});