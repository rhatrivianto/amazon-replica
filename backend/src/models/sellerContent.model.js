import mongoose from 'mongoose';

const sellerContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  subtitle: {
    type: String, // Untuk Label "NEW SELLER INCENTIVES" atau Nama Owner Testimony
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  iconKey: {
    type: String,
    default: 'globe', // globe, trending, check, etc. (Mapping icon di frontend)
    enum: ['globe', 'trending', 'check', 'star', 'dollar'] 
  },
  imageUrl: {
    type: String, // Opsional jika ingin pakai gambar custom
  },
  linkUrl: {
    type: String,
    default: '#'
  },
  section: {
    type: String,
    enum: ['hero', 'guides', 'incentives', 'testimony', 'faq'],
    default: 'guides'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const SellerContent = mongoose.model('SellerContent', sellerContentSchema);

export default SellerContent;
