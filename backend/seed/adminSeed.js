// File: seeds/adminSeed.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model.js"; // Sesuaikan path jika perlu

// --- Konfigurasi Database ---
const DB_URI = "mongodb://127.0.0.1:27017/e-commerce-refactor-v2"; // Ganti dengan URI DB Anda

// --- Data Admin yang Akan Dibuat ---
const adminData = {
    name: "Admin",
    email: "rully@rully.com", // Ganti dengan email admin yang sebenarnya
    password: "Abd123456", // Ganti dengan password yang aman
};

// --- Fungsi Utama Seed ---
async function seedAdmin() {
    try {
        // 1. Koneksi ke Database
        await mongoose.connect(DB_URI);
        console.log("MongoDB berhasil terhubung.");

        // 2. Cek apakah admin sudah ada
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.warn(`❌ Admin dengan email ${adminData.email} sudah ada. Proses seeding dibatalkan.`);
            return;
        }

        // 3. Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // 4. Buat dan Simpan Admin
        const newAdmin = new User({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: "admin", // Kunci di sini
            isEmailVerified: true,
        });

        const savedAdmin = await newAdmin.save();
        console.log("✅ Admin berhasil dibuat:");
        console.log(`   - Nama: ${savedAdmin.name}`);
        console.log(`   - Email: ${savedAdmin.email}`);
        console.log(`   - Role: ${savedAdmin.role}`);

    } catch (error) {
        console.error("🔥 Gagal menjalankan seed admin:", error.message);
    } finally {
        // 5. Tutup Koneksi Database
        await mongoose.disconnect();
        console.log("Koneksi MongoDB ditutup.");
    }
}

seedAdmin();