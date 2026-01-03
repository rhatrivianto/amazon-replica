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
    const { name, email, password } = req.body;

    // 1. Cek jika email sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // 2. Buat token verifikasi
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 3. Simpan user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      isVerified: false
    });

    // 4. URL Verifikasi (Frontend Port 5173)
const verifyUrl = `${env.clientUrl}/verify-email?token=${verificationToken}`;
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
// --- LOGIN ---
export const login = async (req, res) => {
  try {
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
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};