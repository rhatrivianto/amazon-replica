// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
// ✅ Menggunakan konfigurasi dan koneksi DB terpusat
import connectDB from '../config/db.js';
import { auth} from '../config/admin.config.js';

const createAdmin = async () => {
  try {
    // --- 1. Gunakan fungsi koneksi DB yang sudah ada ---
    await connectDB();
    console.log('✅ MongoDB Connected');

    // --- 2. Data Admin dari Environment Variables ---
    const adminEmail = auth.email;
    const adminPassword = auth.password;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
    }

    // --- 3. Cek Apakah Admin Sudah Ada ---
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists.');
      return;
    }

    // --- 4. Buat Admin Baru ---
    //kenapa di off-kan karena di user.model sudah dihashed password
    // const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      name: 'Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true, // Admin tidak perlu verifikasi email
    });

    await adminUser.save();
    console.log('🎉 Admin user created successfully!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    // --- 5. Tutup Koneksi ---
    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
  }
};

createAdmin();
