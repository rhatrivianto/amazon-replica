import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
  method: String,
  transactionId: { type: String, unique: true, index: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], index: true }
}, { timestamps: true });
export default mongoose.model('Payment', paymentSchema);