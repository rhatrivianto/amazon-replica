import Stripe from "stripe";
import { env } from "../config/env.js"; // Gunakan env dari config yang kita buat

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing!");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // Selalu kunci versi API untuk stabilitas
  typescript: false,
});

// Helper untuk membuat Payment Intent (Amazon Style)
export const createPaymentIntent = async (amount, currency = 'usd') => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe menggunakan sen
    currency,
    metadata: { integration_check: 'accept_a_payment' },
  });
};