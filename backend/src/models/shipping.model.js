import mongoose from 'mongoose';
const shippingSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
  trackingNumber: { type: String, index: true },
  carrier: String,
  status: String
}, { timestamps: true });
export default mongoose.model('Shipping', shippingSchema);