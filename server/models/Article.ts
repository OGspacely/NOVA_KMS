import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  gradeLevel: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  youtubeLinks: [{
    title: String,
    url: String
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Draft', 'Pending', 'Approved', 'Rejected'], default: 'Draft' },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }],
  versions: [{
    content: String,
    updatedAt: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    versionNumber: Number
  }],
}, { timestamps: true });

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Article = mongoose.model('Article', articleSchema);
