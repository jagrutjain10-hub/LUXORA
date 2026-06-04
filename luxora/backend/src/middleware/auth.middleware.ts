import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

// ─── AUTHENTICATE ─────────────────────────────────────────────────────────────

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required.', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, isActive: true },
      select: { id: true, role: true },
    });

    if (!user) throw new AppError('User not found or deactivated.', 401);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// ─── OPTIONAL AUTH (for cart, wishlist counts in headers) ─────────────────────

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, isActive: true },
      select: { id: true, role: true },
    });

    if (user) req.user = user;
    next();
  } catch {
    next(); // Silently fail — optional
  }
}

// ─── ROLE GUARDS ──────────────────────────────────────────────────────────────

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
}

export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN');
export const requireSuperAdmin = requireRole('SUPER_ADMIN');
