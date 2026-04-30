import { clerkClient } from '@clerk/clerk-sdk-node';

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = await clerkClient.verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}