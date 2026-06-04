import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './AppError';
import { Role } from '@prisma/client';

interface TokenPayload {
  userId: string;
  role: Role;
}

export function generateTokens(userId: string, role: Role) {
  const accessToken = jwt.sign(
    { userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any, issuer: 'luxora-api' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any, issuer: 'luxora-api' }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'luxora-api' }) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired access token.', 401);
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, { issuer: 'luxora-api' }) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }
}
