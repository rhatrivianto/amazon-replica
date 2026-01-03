import Stripe from 'stripe';
import * as orderService from '../services/order.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res, next) => {
  try {
    // 1. Ambil item dari keranjang via service
    const cartItems = await orderService.prepareOrderData(req.user.id);

    // 2. Format data untuk Stripe
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'idr',
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]], // Stripe minta array
        },
        unit_amount: item.product.price * 100, // Konversi ke sen
      },
      quantity: item.quantity,
    }));

    // 3. Buat Sesi Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/order/success`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id.toString(),
      },
    });

    res.status(200).json({
      status: 'success',
      url: session.url, // URL ini yang akan dibuka oleh frontend
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Memverifikasi bahwa data benar-benar datang dari Stripe
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Jika pembayaran sukses
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Ambil userId yang kita simpan di metadata tadi
    const userId = session.metadata.userId;

    // Selesaikan pesanan di database
    await orderService.finalizeOrder(userId, session);
  }

  res.json({ received: true });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};