import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';
import { protect, AuthRequest } from '../middleware/auth.ts';
import axios from 'axios';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// --- Google OAuth ---
const getRedirectUri = (provider: string) => {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/${provider}/callback`;
};

router.get('/google/url', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID to your secrets.' });
  }

  const redirectUri = getRedirectUri('google');
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const redirect_uri = getRedirectUri('google');
  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri
    });

    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name } = userResponse.data;
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
        role: email === 'eaasante333@gmail.com' ? 'Admin' : 'Student',
      });
    } else if (email === 'eaasante333@gmail.com' && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    }

    const token = generateToken(user._id.toString());
    const userData = { _id: user._id, name: user.name, email: user.email, role: user.role };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: '${token}', user: ${JSON.stringify(userData)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});

// --- Apple OAuth ---
router.get('/apple/url', (req, res) => {
  if (!process.env.APPLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Apple OAuth is not configured. Please add APPLE_CLIENT_ID to your secrets.' });
  }

  const redirectUri = getRedirectUri('apple');
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code id_token',
    scope: 'name email',
    response_mode: 'form_post'
  });
  res.json({ url: `https://appleid.apple.com/auth/authorize?${params.toString()}` });
});

router.post('/apple/callback', async (req, res) => {
  const { code, id_token, user: appleUserStr } = req.body;
  try {
    // Decode ID token to get email
    const decodedToken = jwt.decode(id_token) as any;
    const email = decodedToken?.email;

    if (!email) {
      throw new Error('No email provided by Apple');
    }

    let name = 'Apple User';
    if (appleUserStr) {
      try {
        const appleUser = JSON.parse(appleUserStr);
        name = `${appleUser.name?.firstName || ''} ${appleUser.name?.lastName || ''}`.trim() || name;
      } catch (e) {}
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        role: email === 'eaasante333@gmail.com' ? 'Admin' : 'Student',
      });
    } else if (email === 'eaasante333@gmail.com' && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    }

    const token = generateToken(user._id.toString());
    const userData = { _id: user._id, name: user.name, email: user.email, role: user.role };

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: '${token}', user: ${JSON.stringify(userData)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});

router.post('/firebase', async (req, res) => {
  try {
    const { email, name, uid } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ message: 'Email and UID are required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        password: await bcrypt.hash(uid, 10), // Use uid as a secure random password
        role: email === 'eaasante333@gmail.com' ? 'Admin' : 'Student',
      });
    } else if (email === 'eaasante333@gmail.com' && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: 'Server error during Firebase login', error });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: email === 'eaasante333@gmail.com' ? 'Admin' : (role || 'Student'),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginIdentifier = identifier || email;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Please provide an email/username and password' });
    }

    const user = await User.findOne({ 
      $or: [
        { email: loginIdentifier },
        { name: loginIdentifier }
      ]
    });

    if (user && user.email === 'eaasante333@gmail.com' && user.role !== 'Admin') {
      user.role = 'Admin';
      await user.save();
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/me', protect, (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
