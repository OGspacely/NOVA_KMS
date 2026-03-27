import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
  score: { type: Number },
  feedback: { type: String }
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);
