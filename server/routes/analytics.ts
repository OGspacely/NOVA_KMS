import express from 'express';
import { User } from '../models/User.ts';
import { Article } from '../models/Article.ts';
import { Subject } from '../models/Subject.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

router.get('/stats', protect, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    
    if (user.role === 'Admin') {
      const userCount = await User.countDocuments();
      const articleCount = await Article.countDocuments();
      const approvedCount = await Article.countDocuments({ status: 'Approved' });
      const pendingCount = await Article.countDocuments({ status: 'Pending' });
      const draftCount = await Article.countDocuments({ status: 'Draft' });
      const rejectedCount = await Article.countDocuments({ status: 'Rejected' });

      // Mock chart data for admin
      const viewsOverTime = [
        { name: 'Mon', views: 400 },
        { name: 'Tue', views: 300 },
        { name: 'Wed', views: 550 },
        { name: 'Thu', views: 450 },
        { name: 'Fri', views: 700 },
        { name: 'Sat', views: 200 },
        { name: 'Sun', views: 350 },
      ];

      // Get articles by subject
      const subjects = await Subject.find();
      const articlesBySubject = await Promise.all(
        (Array.isArray(subjects) ? subjects : []).map(async (subject) => {
          const count = await Article.countDocuments({ subject: subject._id });
          return { name: subject.name, count };
        })
      );

      res.json({
        users: userCount,
        articles: {
          total: articleCount,
          approved: approvedCount,
          pending: pendingCount,
          draft: draftCount,
          rejected: rejectedCount
        },
        charts: {
          viewsOverTime,
          articlesBySubject: articlesBySubject.length > 0 ? articlesBySubject : [
            { name: 'Math', count: 12 },
            { name: 'Science', count: 19 },
            { name: 'English', count: 8 }
          ]
        }
      });
    } else {
      // User specific stats
      const myArticles = await Article.find({ author: user._id });
      const totalViews = myArticles.reduce((sum, article) => sum + (article.views || 0), 0);
      const totalLikes = myArticles.reduce((sum, article) => sum + (article.likes?.length || 0), 0);
      
      const viewsOverTime = [
        { name: 'Mon', views: 10 },
        { name: 'Tue', views: 25 },
        { name: 'Wed', views: 15 },
        { name: 'Thu', views: 40 },
        { name: 'Fri', views: 30 },
        { name: 'Sat', views: 5 },
        { name: 'Sun', views: 12 },
      ];

      res.json({
        views: totalViews,
        likes: totalLikes,
        articlesRead: Math.floor(Math.random() * 50), // Mock data
        contributions: myArticles.length,
        charts: {
          viewsOverTime
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
