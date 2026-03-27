import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: String, required: true },
  dueDate: { type: Date, required: true },
  totalPoints: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }]
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', assignmentSchema);
