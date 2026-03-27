import express from 'express';
import { Comment } from '../models/Comment.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get comments for an article
router.get('/:articleId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'name')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add a comment
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const { content, articleId, parentCommentId } = req.body;
    const comment = new Comment({
      content,
      article: articleId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });
    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
