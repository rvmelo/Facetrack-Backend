import 'dotenv/config';
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import 'express-async-errors';
import passport from 'passport';
import cors from 'cors';

import { rateLimiter } from './middlewares/rateLimiters';

import AppError from './errors/appError';

import routes from './routes';

import uploadConfig from './config/upload';

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(
  (user: false | Express.User | null | undefined, cb) => {
    cb(null, user);
  },
);

const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));

app.use(rateLimiter);

app.use(routes);

app.use(errors());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

mongoose.connect('mongodb://localhost:27017/facetrack', () => {
  // eslint-disable-next-line no-console
  app.listen(3333, () => console.log('server started at port 3333'));
});
