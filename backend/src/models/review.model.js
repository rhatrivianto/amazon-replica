import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  review: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// INDEX MAJEMUK: Mencegah satu user memberikan review berkali-kali pada satu produk
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);