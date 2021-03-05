import { Router } from 'express';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import FindUserService from '../services/findUserService';

let user = {};

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/users/auth/facebook/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      const findUserService = new FindUserService();

      const { id } = profile;

      const userData = await findUserService.execute({
        id,
      });

      user = userData
        ? { userData, accessToken }
        : { profile_id: id, accessToken };

      return done(null, profile);
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const findUserService = new FindUserService();

      const { id } = profile;

      const userData = await findUserService.execute({
        id,
      });

      user = userData
        ? { userData, accessToken }
        : { profile_id: id, accessToken };

      return done('', profile);
    },
  ),
);

const userRoutes = Router();

userRoutes.get('/auth/facebook', passport.authenticate('facebook'));

userRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.status(201).json({ user });
  },
);

userRoutes.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

userRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.status(201).json({ user });
  },
);

export default userRoutes;
