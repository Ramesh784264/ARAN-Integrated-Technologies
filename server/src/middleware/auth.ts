import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminUserPayload {
  id: number;
  email: string;
  role: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AdminUserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No authorization token provided.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'aran_default_secret_fallback_key';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Invalid or expired token.' });
      return;
    }
    req.user = decoded as AdminUserPayload;
    next();
  });
};
