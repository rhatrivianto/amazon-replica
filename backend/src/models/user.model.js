import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
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
  avatar: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot be more than 300 characters']
  },
  location: String,
  // --- FIELD UNTUK VERIFIKASI EMAIL ---
  isEmailVerified: {
    type: Boolean,
    default: false, // Default tidak aktif sampai klik link
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
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