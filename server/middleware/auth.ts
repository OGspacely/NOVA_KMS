import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.ts';
import { createClient } from '@supabase/supabase-js';

export interface AuthRequest extends Request {
  user?: any;
}

let supabase: any = null;

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ message: 'Supabase configuration is missing in the backend' });
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token with Supabase
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !supabaseUser) {
        throw new Error('Supabase verification failed');
      }

      // Find or create local user to maintain database relations
      let localUser = await User.findOne({ email: supabaseUser.email });
      
      if (!localUser) {
        localUser = await User.create({
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email,
          password: 'supabase_managed_' + Math.random().toString(36).substring(7),
          role: supabaseUser.user_metadata?.role || (supabaseUser.email === 'eaasante333@gmail.com' ? 'Admin' : 'Student'),
        });
      } else if (supabaseUser.email === 'eaasante333@gmail.com' && localUser.role !== 'Admin') {
        localUser.role = 'Admin';
        await localUser.save();
      }

      req.user = localUser;
      next();
      return;
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};
