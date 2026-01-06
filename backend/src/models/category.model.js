import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nama kategori harus diisi'], 
    unique: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null,
    index: true 
  },
  level: { type: Number, default: 0 }, // Tambahan untuk kedalaman hierarki
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual Field: Untuk mengambil sub-kategori (children) secara otomatis
// Berguna saat menampilkan Menu Navigasi di Frontend
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Middleware: Generate slug otomatis
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Category', categorySchema);