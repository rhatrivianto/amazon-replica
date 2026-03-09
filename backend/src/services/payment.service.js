import Stripe from 'stripe';
import { env } from '../config/env.js';
const stripe = new Stripe(env.stripeSecretKey);

export const createCheckoutSession = async (order) => {
  const lineItems = order.items.map(item => ({
    price_data: {
      currency: 'idr',
      product_data: {
        name: item.product.name,
        // FIX: Pastikan images valid
        images: item.product.images && item.product.images.length > 0 ? item.product.images.slice(0, 8) : [],
      },
      unit_amount: Math.round(item.price * 100), // FIX: Wajib Integer
    },
    quantity: item.quantity,
  }));

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${env.clientUrl}/order-success/${order._id}`,
    cancel_url: `${env.clientUrl}/cart`,
    client_reference_id: order._id.toString(),
    customer_email: order.user.email,
  });
};