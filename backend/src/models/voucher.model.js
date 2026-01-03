import mongoose from 'mongoose';
const voucherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  code: String,
  isUsed: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Voucher', voucherSchema);