import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';

export interface AuthenticatedRequest extends Request {
  user?: {
    userID: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userID: number; email: string };

    const user = await User.findByPk(decoded.userID);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      userID: user.userID || 0,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
