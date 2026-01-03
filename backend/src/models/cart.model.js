import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Jumlah minimal adalah 1'],
    default: 1
  },
  price: { type: Number, required: true } // Harga saat barang dimasukkan ke keranjang
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Satu user hanya punya satu keranjang aktif
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Middleware: Hitung Total Harga Otomatis sebelum save
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model('Cart', cartSchema);