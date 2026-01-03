import mongoose from 'mongoose';
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  discountRate: Number,
  expiryDate: { type: Date, index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Coupon', couponSchema);