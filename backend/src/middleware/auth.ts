import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      error: { code: 'AUTH_TOKEN_MISSING' },
    });
  }

  const secret = process.env.JWT_SECRET || 'vighnaharta_puja_committee_super_secret_jwt_key_2026';

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
        error: { code: 'AUTH_TOKEN_INVALID' },
      });
    }

    req.user = decoded;
    next();
  });
};
