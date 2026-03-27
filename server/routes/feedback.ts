import express from 'express';
import { protect, AuthRequest } from '../middleware/auth.ts';
import mongoose from 'mongoose';

const router = express.Router();

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['suggestion', 'bug', 'other'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Submit feedback
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const { type, content } = req.body;
    
    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required' });
    }

    const feedback = new Feedback({
      user: req.user._id,
      type,
      content
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get feedback (Admin only)
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const feedback = await Feedback.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
