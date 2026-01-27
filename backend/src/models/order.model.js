import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true } // Harga tetap saat dibeli
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    fullName: String, // Tambahkan ini agar nama penerima tersimpan
    phone: String,    // Tambahkan ini untuk kontak kurir
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paidAt: Date
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);