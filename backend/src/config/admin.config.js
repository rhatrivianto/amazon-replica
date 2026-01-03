import dotenv from 'dotenv';
import path from 'path';

// Memastikan dotenv membaca file .env dari direktori root proyek (Standard Amazon)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Konfigurasi Utama Admin
 * File ini mengontrol keamanan dashboard dan kredensial administratif.
 */
export const adminConfig = {
  // 1. Kredensial Inisial (Dari .env Anda)
  // Digunakan untuk setup pertama kali atau akses Super Admin darurat
  auth: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    setupKey: process.env.ADMIN_SETUP_KEY, // Kunci rahasia untuk registrasi admin baru
  },

  // 2. Keamanan & Proteksi Akses
  security: {
    superAdminEmail: process.env.ADMIN_EMAIL || 'admin@amazon-clone.com',
    // Brute Force Protection
    loginAttempts: {
      max: 5,
      lockTime: 2 * 60 * 60 * 1000, // Kunci akun 2 jam jika salah 5x
    },
  },

  // 3. Pengaturan Dashboard & Inventori (Sinkron ke inventory.service)
  dashboard: {
    lowStockThreshold: 10,       // Alert jika stok < 10
    recentOrdersLimit: 5,        // Tampilan order terbaru
    salesChartPeriod: 'monthly', // Default analitik
  },

  // 4. Manajemen Izin (RBAC - Role Based Access Control)
  // Sinkron dengan User Model (admin, seller, user)
  permissions: {
    MANAGE_USERS: ['admin'],
    MANAGE_PRODUCTS: ['admin', 'seller'],
    VIEW_ANALYTICS: ['admin'],
    MANAGE_PAYMENTS: ['admin'],
    MANAGE_SYSTEM_DB: ['admin'], 
  },

  // 5. Status Sistem
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true' || false,
};

// Export individual untuk kemudahan akses di Controller/Service
export const { auth, security, dashboard, permissions } = adminConfig;