import mongoose from 'mongoose';
const emailLogSchema = new mongoose.Schema({
  to: { type: String, index: true },
  subject: String,
  status: { type: String, enum: ['sent', 'failed'], index: true }
}, { timestamps: true });
export default mongoose.model('EmailLog', emailLogSchema);