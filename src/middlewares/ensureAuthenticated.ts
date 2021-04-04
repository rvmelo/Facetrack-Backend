import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/appError';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export default function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    throw new AppError('JWT is missing', 401);
  }

  const token = authHeaders?.split(' ')[1];

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    req.user = { id: sub };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
