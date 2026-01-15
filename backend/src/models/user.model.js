import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: 6,
    select: false, // Agar password tidak ikut terambil saat query biasa
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user',
  },
  storeName: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple users to have null/undefined storeName
    trim: true
  },
  // --- FIELD UNTUK VERIFIKASI EMAIL ---
  isVerified: {
    type: Boolean,
    default: false, // Default tidak aktif sampai klik link
  },
  verificationToken: String,
  passwordResetToken: String, 
  passwordResetExpires: Date,
}, { timestamps: true });

// Hash password sebelum disimpan ke database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method untuk membandingkan password saat login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Tambahkan Method ini di bawah method comparePassword
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token agar jika DB bocor, hacker tidak bisa pakai tokennya
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Menit

  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;