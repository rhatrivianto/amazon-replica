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
import { authLimiter, globalLimiter } from "./middlewares/rateLimit.middleware.js";

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
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.stripe.com"],
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
app.use("/api/v1", apiRoutes); 

app.use('/api/v1/seller-contents', sellerContentRouter);

// Root Route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Amazon Clone API v1.0.0 Active" });
});

// --- 6. SERVING FRONTEND IN PRODUCTION ---
if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (_, res) => res.sendFile(path.join(frontendPath, "index.html")));
}

// --- 7. ERROR HANDLING ---
app.use(globalErrorHandler);

export default app;

