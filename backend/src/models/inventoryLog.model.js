import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true 
  },
  change: { type: Number, required: true }, // Contoh: -1 (terjual), +10 (restock)
  type: { 
    type: String, 
    enum: ['sale', 'restock', 'return', 'adjustment', 'damage'],
    required: true,
    index: true
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Jika diubah manual oleh admin
  reason: String
}, { timestamps: true });

export default mongoose.model('InventoryLog', inventoryLogSchema);