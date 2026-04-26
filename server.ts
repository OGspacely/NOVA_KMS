import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { connectDB } from './server/db.ts';
import authRoutes from './server/routes/auth.ts';
import articleRoutes from './server/routes/articles.ts';
import commentRoutes from './server/routes/comments.ts';
import searchRoutes from './server/routes/search.ts';
import adminRoutes from './server/routes/admin.ts';
import analyticsRoutes from './server/routes/analytics.ts';
import userRoutes from './server/routes/users.ts';
import forumRoutes from './server/routes/forum.ts';
import assignmentRoutes from './server/routes/assignments.ts';
import announcementRoutes from './server/routes/announcements.ts';
import feedbackRoutes from './server/routes/feedback.ts';
import { notificationRoutes } from './server/routes/notifications.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isDev = process.env.NODE_ENV !== 'production';

  // ── Security Headers (Helmet) ─────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: isDev ? false : {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
          frameSrc: ["https://accounts.google.com"],
        },
      },
      crossOriginEmbedderPolicy: false, // needed for OAuth popups
    })
  );

  // ── CORS ──────────────────────────────────────────────────
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.APP_URL,
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy: origin '${origin}' not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ── Body Size Limits (prevent DoS) ────────────────────────
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // ── Global Rate Limiter ───────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  // ── Strict Auth Rate Limiter (brute-force protection) ────
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  });

  app.use('/api/', globalLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/reset-password', authLimiter);

  // ── Connect to MongoDB ────────────────────────────────────
  await connectDB();

  // ── Static Files ──────────────────────────────────────────
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // ── API Routes ────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/forum', forumRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/notifications', notificationRoutes);

  // ── Health Check ──────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Vite Dev / Production Static ─────────────────────────
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // ── Global Error Handler ──────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({
      error: isDevelopment ? err.message : 'Internal server error',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Security: Helmet ✓ | CORS restricted ✓ | Rate limiting ✓`);
  });
}

startServer();

