import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
dotenv.config();

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const payload = await clerk.verifyToken(token, {
      authorizedParties: [
        'https://meetmind-two.vercel.app',
        'http://localhost:5173'
      ]
    });

    req.userId = payload.sub;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}