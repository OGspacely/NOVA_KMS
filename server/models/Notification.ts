import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['assignment', 'article', 'quiz', 'grade', 'forum', 'system'], default: 'system' },
  unread: { type: Boolean, default: true },
  link: { type: String }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
