import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String },
  ipAddress: { type: String }
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
