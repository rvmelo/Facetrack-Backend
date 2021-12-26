import rateLimit from 'express-rate-limit';
import { Request } from 'express';

import AppError from '../errors/appError';

export const rateLimiter = rateLimit({
  windowMs: 1 * 1000,
  max: 5,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(): void {
    throw new AppError('too many requests', 429);
  },
});

export const instagramRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(): void {
    throw new AppError('too many requests', 429);
  },
});
