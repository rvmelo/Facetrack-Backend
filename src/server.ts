import 'dotenv/config';
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { rateLimiter } from './middlewares/rateLimiters';

import AppError from './errors/appError';

import routes from './routes';

import uploadConfig from './config/upload';

const app = express();
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(cookieParser(process.env.SESSION_SECRET));

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

mongoose.connect(`${process.env.MONGODB_URL}?authSource=admin`, () => {
  // eslint-disable-next-line no-console
  app.listen(3333, () => console.log('server started at port 3333'));
});

// eslint-disable-next-line no-console
mongoose.connection.on('error', error => console.log('error: ', error));
