import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';



// Helper untuk membuat Token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// --- REGISTER ---
export const register = async (req, res) => {
  try {
    const { name, email, password, role, storeName } = req.body;

    // 1. Cek jika email sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // 2. Validasi Khusus Seller
    if (role === 'seller') {
      if (!storeName) return res.status(400).json({ success: false, message: 'Store Name wajib diisi untuk seller.' });
      
      const storeExists = await User.findOne({ storeName });
      if (storeExists) {
        return res.status(400).json({ success: false, message: 'Nama Toko sudah digunakan. Pilih nama lain.' });
      }
    }

    // 2. Buat token verifikasi
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 3. Simpan user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'seller' ? 'seller' : 'user',
      storeName: role === 'seller' ? storeName : undefined,
      verificationToken,
      isVerified: false
    });

    // 4. URL Verifikasi (Frontend Port 5173)
    const verifyUrl = `${env.clientUrl}/verify-email?token=${verificationToken}`;

    // URL Alternatif: Langsung ke Backend (Bypass Frontend jika 404)
    const directVerifyUrl = `https://amazon-replica-production.up.railway.app/api/v1/auth/verify-email?token=${verificationToken}`;

    // --- DEBUG: Tampilkan Link di Log Railway agar bisa diklik manual ---
    console.log("🚀 [DEBUG] Frontend Link:", verifyUrl);
    console.log("🚀 [DEBUG] Direct Backend Link (Gunakan ini jika Frontend 404):", directVerifyUrl);

    // 5. Kirim Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Aktivasi Akun Rully Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #232f3e;">Verifikasi Alamat Email Anda</h2>
            <p>Halo ${name},</p>
            <p>Terima kasih telah mendaftar di Rully Store. Klik tombol di bawah untuk verifikasi:</p>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #ffd814; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verifikasi Akun
            </a>
          </div>
        `
      });

    res.status(201).json({
      success: true,
      message: 'Email verifikasi telah dikirim ke Mailtrap.'
      });
    } catch (emailError) {
      console.error("❌ Gagal mengirim email verifikasi:", emailError.message);
      // Tetap return sukses karena user sudah terbuat di DB
      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil, namun email verifikasi gagal terkirim. Silakan hubungi admin.'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- VERIFY EMAIL ---
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // 1. Coba cari user dengan token tersebut
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      // Jika token tidak ditemukan, jangan langsung kasih error 400
      // Kita tidak tahu apakah tokennya salah atau sudah sukses terhapus
      return res.status(200).json({ 
        success: true, 
        message: 'Email sudah aktif atau sudah diverifikasi.' 
      });
    }

    // 2. Jika ditemukan, verifikasi
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email berhasil diverifikasi!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User dengan email tersebut tidak ditemukan.' });
    }

    // 1. Generate Random Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Simpan Hash Token ke DB & Set Expire (10 Menit)
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Menit dari sekarang
    await user.save({ validateBeforeSave: false });

    // 3. Kirim Email
    const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Password Anda (Berlaku 10 Menit)',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>Permintaan Reset Password</h2>
            <p>Klik tombol di bawah untuk mengatur ulang kata sandi Anda:</p>
            <a href="${resetUrl}" style="background: #e47911; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
          </div>
        `
      });

      res.status(200).json({ success: true, message: 'Link reset password telah dikirim ke email.' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Gagal mengirim email. Coba lagi nanti.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  try {
    // 1. Ambil token dari params dan hash untuk dicocokkan dengan DB
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Cari user yang memiliki token tersebut dan BELUM expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    // 3. Update Password & Bersihkan token reset
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password berhasil diubah. Silakan login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    console.log("📦 Data dari Frontend(user):", req.body);
    const { email, password } = req.body;

// 1. Cek Email & Password
const user = await User.findOne({ email }).select('+password');
if (!user || !(await user.comparePassword(password))) {
  return res.status(401).json({ success: false, message: 'Email atau password salah' });
}

// 2. Proteksi Portal Admin (Pastikan Admin login di /admin/login)
if (user.role === 'admin' && !req.originalUrl.includes('admin')) {
  return res.status(403).json({ success: false, message: 'Silakan gunakan portal login admin.' });
}

// 3. LOGIKA YANG KITA BAHAS: Cegah User yang belum verifikasi
if (user.role === 'user' && !user.isVerified) {
  return res.status(403).json({ success: false, message: 'Silakan verifikasi email Anda terlebih dahulu.' });
}

// 4. Jika semua lolos, buat Token
const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName // Tambahkan ini agar muncul di Dashboard
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- REGISTER SELLER (UPGRADE ACCOUNT) ---
export const registerSeller = async (req, res) => {
  try {
    const { storeName } = req.body;
    const userId = req.user._id; // Didapat dari middleware protect

    // 0. Cek apakah user sudah menjadi seller
    const currentUser = await User.findById(userId);
    // FIX: Hanya tolak jika dia seller DAN sudah punya nama toko.
    // Jika dia seller tapi storeName kosong (kasus Ustman), biarkan dia lanjut untuk set nama toko.
    if (currentUser.role === 'seller' && currentUser.storeName) {
      return res.status(400).json({ success: false, message: 'Anda sudah terdaftar sebagai seller.' });
    }

    if (!storeName) {
      return res.status(400).json({ success: false, message: 'Store Name is required.' });
    }

    // Cek ketersediaan nama toko
    const storeExists = await User.findOne({ storeName });
    if (storeExists) {
      return res.status(400).json({ success: false, message: 'Store Name is already taken.' });
    }

    // Update user role menjadi seller
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: 'seller', storeName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Account upgraded to Seller successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        storeName: updatedUser.storeName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};