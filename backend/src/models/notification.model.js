import mongoose from 'mongoose';
const pageSectionSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['banner', 'carousel', 'grid'], index: true },
  content: Array,
  order: { type: Number, index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('PageSection', pageSectionSchema);