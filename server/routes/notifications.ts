import express from 'express';
import { Notification } from '../models/Notification.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get all notifications for the current user
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    let notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
      
    if (notifications.length === 0) {
      // Create some dummy notifications
      const dummyNotifications = [
        { user: req.user.id, text: 'Welcome to the platform!', type: 'system', unread: true },
        { user: req.user.id, text: 'Check out the new AI Assistant feature.', type: 'system', unread: true },
        { user: req.user.id, text: 'Your profile has been successfully set up.', type: 'system', unread: false }
      ];
      await Notification.insertMany(dummyNotifications);
      notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);
    }
      
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// Mark a single notification as read
router.put('/:id/read', protect, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { unread: false },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', protect, async (req: AuthRequest, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, unread: true },
      { unread: false }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating notifications' });
  }
});

// Delete a notification
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting notification' });
  }
});

export const notificationRoutes = router;
