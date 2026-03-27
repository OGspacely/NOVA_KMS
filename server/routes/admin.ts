import express from 'express';
import { User } from '../models/User.ts';
import { Article } from '../models/Article.ts';
import { Subject } from '../models/Subject.ts';
import { Topic } from '../models/Topic.ts';
import { AuditLog } from '../models/AuditLog.ts';
import { protect, authorize, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get admin stats
router.get('/stats', protect, authorize('Admin'), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const articleCount = await Article.countDocuments();
    const approvedCount = await Article.countDocuments({ status: 'Approved' });
    const pendingCount = await Article.countDocuments({ status: 'Pending' });
    const draftCount = await Article.countDocuments({ status: 'Draft' });
    const rejectedCount = await Article.countDocuments({ status: 'Rejected' });

    res.json({
      users: userCount,
      articles: {
        total: articleCount,
        approved: approvedCount,
        pending: pendingCount,
        draft: draftCount,
        rejected: rejectedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all users
router.get('/users', protect, authorize('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update user role/status
router.put('/users/:id', protect, authorize('Admin'), async (req: AuthRequest, res) => {
  try {
    const { role, isActive, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, isVerified },
      { new: true }
    ).select('-password');
    
    await AuditLog.create({
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: user?._id,
      user: req.user._id,
      details: `Updated user role to ${role}, active: ${isActive}, verified: ${isVerified}`,
      ipAddress: req.ip
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete user
router.delete('/users/:id', protect, authorize('Admin'), async (req: AuthRequest, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    
    await AuditLog.create({
      action: 'DELETE_USER',
      entityType: 'User',
      entityId: req.params.id,
      user: req.user._id,
      details: `Deleted user ${req.params.id}`,
      ipAddress: req.ip
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all articles (with optional status filter)
router.get('/articles', protect, authorize('Admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const articles = await Article.find(query)
      .populate('author', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort('-createdAt');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create subject
router.post('/subjects', protect, authorize('Admin'), async (req, res) => {
  try {
    const subject = new Subject({ name: req.body.name });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create topic
router.post('/topics', protect, authorize('Admin'), async (req, res) => {
  try {
    const topic = new Topic({ name: req.body.name, subject: req.body.subject });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get audit logs
router.get('/audit-logs', protect, authorize('Admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort('-createdAt')
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// System settings (mock)
let systemSettings = {
  maintenanceMode: false,
  allowRegistration: true,
  maxUploadSize: 10, // MB
  paymentGateway: 'stripe',
  apiKey: 'sk_test_12345'
};

router.get('/settings', protect, authorize('Admin'), (req, res) => {
  res.json(systemSettings);
});

router.put('/settings', protect, authorize('Admin'), async (req: AuthRequest, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  
  await AuditLog.create({
    action: 'UPDATE_SETTINGS',
    entityType: 'System',
    user: req.user._id,
    details: 'Updated system settings',
    ipAddress: req.ip
  });

  res.json(systemSettings);
});

export default router;
