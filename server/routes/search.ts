import express from 'express';
import { Article } from '../models/Article.ts';
import { Subject } from '../models/Subject.ts';
import { Topic } from '../models/Topic.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

// Get all subjects
router.get('/subjects', protect, async (req, res) => {
  try {
    const subjects = await Subject.find().sort('name');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all topics
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await Topic.find().populate('subject', 'name').sort('name');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Search articles
router.get('/', protect, async (req, res) => {
  try {
    const { q, subject, topic } = req.query;
    
    let query: any = { status: 'Approved' };
    
    if (q) {
      query.$text = { $search: q as string };
    }
    
    if (subject) {
      query.subject = subject;
    }
    
    if (topic) {
      query.topic = topic;
    }

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

export default router;
