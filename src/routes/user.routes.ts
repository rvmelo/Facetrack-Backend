import { Router } from 'express';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../models/User';

import FindUserService from '../services/findUserService';

interface UserAuthData {
  user: User | undefined;
  token: string;
}

let userData = {} as UserAuthData;

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

      userData = await findUserService.execute({
        id,
      });

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

      userData = await findUserService.execute({
        id,
      });

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
    res.redirect(
      `${process.env.EXPO_CLIENT_URL}?token=${userData.token}}&user=${userData.user}`,
    );
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
    res.redirect(
      `${process.env.EXPO_CLIENT_URL}?token=${userData.token}&user=${userData.user}`,
    );
  },
);

export default userRoutes;
