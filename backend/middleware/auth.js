// backend/middleware/auth.js
import { verifyToken } from '../utils/jwt.js';

export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized: token missing' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized: invalid token' });

  // attach user info to request
  req.user = { id: payload.id, email: payload.email };
  next();
}
