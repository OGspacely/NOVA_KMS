import express from 'express';
import { Question } from '../models/Question.ts';
import { Answer } from '../models/Answer.ts';
import { User } from '../models/User.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get all questions
router.get('/questions', protect, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'name role')
      .populate('subject', 'name')
      .sort('-createdAt');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create a question
router.post('/questions', protect, async (req: AuthRequest, res) => {
  try {
    const question = new Question({
      ...req.body,
      author: req.user._id
    });
    await question.save();
    
    // Reward user for asking
    await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 2 } });
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a single question with answers
router.get('/questions/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name role')
      .populate('subject', 'name');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answers = await Answer.find({ question: question._id })
      .populate('author', 'name role')
      .sort('-upvotes -createdAt');

    res.json({ question, answers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Post an answer
router.post('/questions/:id/answers', protect, async (req: AuthRequest, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content: req.body.content,
      author: req.user._id,
      question: question._id
    });
    await answer.save();

    question.answersCount += 1;
    await question.save();

    // Reward user for answering
    await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 5 } });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Upvote a question
router.post('/questions/:id/upvote', protect, async (req: AuthRequest, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const userId = req.user._id;
    const hasUpvoted = question.upvotes.includes(userId);

    if (hasUpvoted) {
      question.upvotes = question.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      question.upvotes.push(userId);
    }

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Upvote an answer
router.post('/answers/:id/upvote', protect, async (req: AuthRequest, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user._id;
    const hasUpvoted = answer.upvotes.includes(userId);

    if (hasUpvoted) {
      answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      answer.upvotes.push(userId);
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
