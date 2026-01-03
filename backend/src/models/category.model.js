// import mongoose from 'mongoose';
// import slugify from 'slugify';

// const categorySchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, 'Nama kategori harus diisi'], 
//     unique: true, 
//     trim: true 
//   },
//   slug: { 
//     type: String, 
//     unique: true, 
//     lowercase: true 
//   },
//   parent: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Category', 
//     default: null,
//     index: true 
//   },
//   description: String,
//   image: String,
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Middleware untuk otomatis membuat slug sebelum save
// categorySchema.pre('save', function(next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

// // Virtual untuk mendapatkan Sub-Categories secara otomatis
// categorySchema.virtual('children', {
//   ref: 'Category',
//   localField: '_id',
//   foreignField: 'parent'
// });

// export default mongoose.model('Category', categorySchema);

//
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
  level: { type: Number, default: 0 } // Tambahan untuk kedalaman BTG
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Amazon Style: Logic untuk menentukan level kedalaman kategori
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Category', categorySchema);