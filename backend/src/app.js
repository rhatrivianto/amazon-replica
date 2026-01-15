import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import fs from 'fs';

import { corsOptions } from "./config/cors.config.js";
import apiRoutes from "./routes/index.js"; 
import sellerContentRouter from "./routes/sellerContent.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import adminRoutes from "./routes/admin.route.js";
import seedRoutes from "./routes/seed.route.js";
import addressRoutes from "./routes/address.route.js";
import sellerRoutes from "./routes/seller.route.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi app HARUS di atas sebelum app.use apapun
const app = express();

app.use(cors(corsOptions));




app.set('trust proxy', 1); // Penting untuk Railway/Heroku agar Rate Limiter & Cookie aman
const isProduction = process.env.NODE_ENV === 'production';

// Buat folder public jika belum ada
const productDir = path.join(__dirname, '../public/img/products');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

// --- 1. STRIPE WEBHOOK (URUTAN NOMOR SATU) ---
// Harus di atas express.json() karena Stripe butuh buffer asli (raw body)
app.use('/api/v1/orders/webhook', express.raw({ type: 'application/json' }));

// --- 2. SECURITY (Helmet & CORS) ---
app.use(helmet({
  crossOriginResourcePolicy: isProduction ? { policy: "cross-origin" } : false,
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.stripe.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.stripe.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  } : false
}));


// --- 3. BODY PARSING (Untuk rute selain webhook) ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Static folder
app.use('/public', express.static(path.join(__dirname, '../public')));

// --- 4. RATE LIMITING ---
app.use("/api", globalLimiter);


// --- 5. ROUTES ---
// Semua rute (auth, products, orders) masuk lewat sini
app.use("/api/v1/admin", adminRoutes);   // Untuk Super Admin (Kekuasaan penuh)
app.use("/api/v1/seller", sellerRoutes); // Untuk Penjual (Hanya produk miliknya)
app.use("/api/v1", apiRoutes);           // Untuk Pembeli & Umum (Read-only)

app.use("/api/v1/seed", seedRoutes); // Route khusus seeding
app.use("/api/v1/addresses", addressRoutes); // Route alamat user

app.use('/api/v1/seller-contents', sellerContentRouter);

// --- 6. SERVING FRONTEND IN PRODUCTION ---
if (isProduction) {
  // Gunakan ../../ karena app.js ada di dalam backend/src/ (naik 2 level ke root, lalu masuk frontend)
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  // Cek apakah folder ada sebelum serve (Agar aman di Railway, tapi tetap jalan di Local jika ada build)
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get("*", (_, res) => res.sendFile(path.join(frontendPath, "index.html")));
  } else {
    // FALLBACK: Jika build frontend tidak ditemukan (Mencegah Health Check Error 404)
    console.warn(`⚠️ Frontend build not found at: ${frontendPath}`);
    app.get("/", (_, res) => res.status(200).json({ 
      status: "success", 
      message: "Backend API is running. Frontend build is missing (Check Build Logs)." 
    }));
  }
}

// --- 7. ERROR HANDLING ---
app.use(globalErrorHandler);

export default app;
