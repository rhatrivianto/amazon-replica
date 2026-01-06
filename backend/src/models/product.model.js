import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // --- IDENTITAS DASAR ---
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  
  // --- IDENTITAS AMAZON (Crucial) ---
  // ASIN digunakan untuk pelacakan global dan integrasi sistem eksternal
  asin: { type: String, unique: true, sparse: true, uppercase: true }, 
  modelNumber: { type: String, trim: true },

  // --- FINANSIAL & STOK ---
  price: { type: Number, required: true, index: true },
  stock: { type: Number, default: 0, index: true },
  discountPercentage: { type: Number, default: 0 }, // Untuk label "-15%" di UI

  // --- KONTEN VISUAL & DESKRIPSI ---
  images: [String],
  description: { type: String, required: true },
  // bulletPoints: Digunakan untuk bagian "About this item" yang berupa list
  bulletPoints: [{ type: String, trim: true }], 

  // --- SPESIFIKASI TEKNIS (Dynamic Grid) ---
  // Memungkinkan filter dinamis seperti "Voltage" atau "Battery Capacity"
  specifications: [{
    key: { type: String },   // Contoh: "Color", "Material"
    value: { type: String }  // Contoh: "Black", "Carbon Steel"
  }],

  // --- LOGISTIK & PENGIRIMAN ---
  shippingInfo: {
    weight: { type: String },     // Contoh: "1.2 lbs"
    dimensions: { type: String }, // Contoh: "10 x 5 x 2 inches"
    shipsFrom: { type: String, default: "Amazon" }, //
    soldBy: { type: String, required: true }        //
  },

  // --- STATUS & BADGES ---
  isPrime: { type: Boolean, default: false },
  // Menampilkan badge "Small Business" di bawah deskripsi
  isSmallBusiness: { type: Boolean, default: false }, 
  isClimatePledgeFriendly: { type: Boolean, default: false },

  // --- SOSIAL & RATING ---
  ratingsAverage: { type: Number, default: 0, index: true },
  numReviews: { type: Number, default: 0 },
  
  // --- SEO & SEARCH OPTIMIZATION ---
  tags: [String], // Keyword tambahan untuk algoritma pencarian
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- INDEXING UNTUK SEARCH ENGINE ---
// Nama produk bobot 10, Deskripsi bobot 5, BulletPoints bobot 3
productSchema.index(
  { 
    name: 'text', 
    description: 'text', 
    bulletPoints: 'text',
    tags: 'text' 
  },
  { 
    weights: { 
      name: 10, 
      description: 5, 
      bulletPoints: 3,
      tags: 7 
    }, 
    name: 'AmazonSearchIndex' 
  }
);

// Index Gabungan untuk performa filter di halaman kategori
productSchema.index({ category: 1, price: 1, ratingsAverage: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;