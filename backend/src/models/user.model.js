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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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

const User = mongoose.model('User', userSchema);
export default User;