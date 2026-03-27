import express from 'express';
import { Announcement } from '../models/Announcement.ts';
import { protect, authorize, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get announcements
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    let query = {};
    if (req.user.role === 'Student') {
      query = { targetAudience: { $in: ['All', 'Students'] } };
    } else if (req.user.role === 'Teacher') {
      query = { targetAudience: { $in: ['All', 'Teachers'] } };
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name role')
      .sort('-createdAt')
      .limit(10);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create announcement (Teacher/Admin)
router.post('/', protect, authorize('Teacher', 'Admin'), async (req: AuthRequest, res) => {
  try {
    const announcement = new Announcement({
      ...req.body,
      author: req.user._id
    });
    const created = await announcement.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete announcement
router.delete('/:id', protect, authorize('Teacher', 'Admin'), async (req: AuthRequest, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Not found' });

    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
