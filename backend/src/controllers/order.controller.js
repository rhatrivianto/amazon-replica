import Stripe from 'stripe';
import * as orderService from '../services/order.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res, next) => {
  try {
    // FIX: Bersihkan CLIENT_URL dari spasi atau newline yang tidak sengaja terbawa
    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim() : '';

    // 1. Ambil item dari keranjang via service
    const cartItems = await orderService.prepareOrderData(req.user.id);

    // Tambahkan Pengecekan Keamanan (Defensive Programming)
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Your cart is empty. Please add products before proceeding.'
      });
    }

    // 2. Format data untuk Stripe
    const line_items = cartItems.map((item) => {
      // VALIDASI GAMBAR: Stripe wajib URL online (http/https).
      // Jika gambar masih lokal (localhost) atau rusak, jangan kirim ke Stripe agar tidak Error 400.
      let validImages = [];
      if (item.product.images && item.product.images.length > 0) {
        const img = item.product.images[0];
        if (img && img.startsWith('http')) {
          validImages = [img];
        }
      }

      // FIX: Pastikan harga valid & bulat
      const unitAmount = item.product.price ? Math.round(item.product.price * 100) : 0;

      return {
        price_data: {
          currency: 'idr',
          product_data: {
            name: item.product.name,
            images: validImages, // Hanya kirim jika URL valid
          },
          unit_amount: unitAmount, // WAJIB BULAT (Integer), Stripe menolak desimal
        },
        quantity: item.quantity,
      };
    });

    // 3. Buat Sesi Stripe
    // --- AMAZON STYLE RESILIENCE ---
    // Coba buat sesi dengan gambar. Jika gagal (misal URL gambar mati/invalid),
    // otomatis coba lagi TANPA gambar agar user tetap bisa bayar.
    let session;
    const sessionConfig = {
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${clientUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/order/cancel`,
      customer_email: req.user.email,
      metadata: { userId: req.user._id.toString() },
    };

    try {
      // Percobaan 1: Dengan Gambar
      session = await stripe.checkout.sessions.create({
        ...sessionConfig,
        line_items: line_items
      });
    } catch (stripeError) {
      console.warn("⚠️ [Stripe] Gagal dengan gambar, mencoba fallback tanpa gambar...", stripeError.message);
      
      // Percobaan 2: Hapus gambar dari payload
      const line_items_no_image = line_items.map(item => ({
        ...item,
        price_data: {
          ...item.price_data,
          product_data: {
            name: item.price_data.product_data.name, // Ambil nama saja, tanpa images
          }
        }
      }));

      session = await stripe.checkout.sessions.create({
        ...sessionConfig,
        line_items: line_items_no_image
      });
    }

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
    console.log("🔔 [Webhook] Menerima sinyal dari Stripe...");
    
    // Memverifikasi bahwa data benar-benar datang dari Stripe
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ [Webhook] Signature Verified! Event:", event.type);
  } catch (err) {
    console.error(`❌ [Webhook Error]: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Jika pembayaran sukses
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata ? session.metadata.userId : null;
    
    console.log(`💰 [Webhook] Payment Success for User: ${userId}`);

    if (userId) {
      try {
        // Selesaikan pesanan di database
        await orderService.finalizeOrder(userId, session);
        console.log("📦 [Webhook] Order Created & Cart Cleared!");
      } catch (error) {
        console.error("❌ [Webhook] Gagal memproses order:", error);
      }
    }
  }

  res.json({ received: true });
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ message: 'Session ID is required' });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      // Panggil service untuk membuat order & kosongkan keranjang
      // Note: Service sebaiknya mengecek apakah order dengan session_id ini sudah ada (idempotency)
      const order = await orderService.finalizeOrder(userId, session);
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Payment verified and order created.',
        orderId: order?._id 
      });
    } else {
      res.status(400).json({ status: 'fail', message: 'Payment not successful yet.' });
    }
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};
