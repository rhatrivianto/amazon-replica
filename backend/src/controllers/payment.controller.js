import * as paymentService from '../services/payment.service.js';
import Order from '../models/order.model.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product user');
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

    const session = await paymentService.createCheckoutSession(order);
    res.status(200).json({ status: 'success', sessionUrl: session.url });
  } catch (error) { next(error); }
};

// WEBHOOK: Dipanggil otomatis oleh Stripe saat pembayaran sukses
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update Order di Database jadi Lunas (Paid)
    await Order.findByIdAndUpdate(session.client_reference_id, {
      paymentStatus: 'paid',
      paidAt: Date.now(),
      status: 'processing'
    });
  }

  res.status(200).json({ received: true });
};