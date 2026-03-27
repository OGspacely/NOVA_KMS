import express from 'express';
import { User } from '../models/User.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get current user profile
router.get('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update current user profile
router.put('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.studentId = req.body.studentId || user.studentId;
    user.program = req.body.program || user.program;
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
