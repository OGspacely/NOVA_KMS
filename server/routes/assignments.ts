import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Assignment } from '../models/Assignment.ts';
import { Submission } from '../models/Submission.ts';
import { protect, authorize, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Get all assignments
router.get('/', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('author', 'name')
      .sort('-createdAt');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create assignment (Teacher/Admin)
router.post('/', protect, authorize('Teacher', 'Admin'), upload.array('files', 5), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const attachments = files ? files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      type: file.mimetype
    })) : [];

    const assignment = new Assignment({
      ...req.body,
      attachments,
      author: req.user._id
    });
    const created = await assignment.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single assignment
router.get('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('author', 'name');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Submit assignment (Student)
router.post('/:id/submit', protect, upload.array('files', 5), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const attachments = files ? files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      type: file.mimetype
    })) : [];

    const submission = new Submission({
      assignment: req.params.id,
      student: req.user._id,
      content: req.body.content,
      attachments
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get submissions for an assignment (Teacher/Admin)
router.get('/:id/submissions', protect, authorize('Teacher', 'Admin'), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name studentId')
      .sort('-createdAt');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Grade submission (Teacher/Admin)
router.put('/submissions/:subId/grade', protect, authorize('Teacher', 'Admin'), async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.subId,
      { 
        score: req.body.score,
        feedback: req.body.feedback,
        status: 'Graded'
      },
      { new: true }
    );
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
