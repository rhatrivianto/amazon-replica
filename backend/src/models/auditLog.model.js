import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true }, // e.g., 'DELETE_USER', 'UPDATE_PRODUCT'
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  details: Object,
  ipAddress: String
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);