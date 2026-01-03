import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (order) => {
  const lineItems = order.items.map(item => ({
    price_data: {
      currency: 'idr',
      product_data: {
        name: item.product.name,
        images: item.product.images,
      },
      unit_amount: item.price * 100, // Rupiah ke Sen
    },
    quantity: item.quantity,
  }));

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/order-success/${order._id}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    client_reference_id: order._id.toString(),
    customer_email: order.user.email,
  });
};