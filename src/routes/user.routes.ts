import { Router } from 'express';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/users/auth/facebook/callback`,
    },

    function authLogin(accessToken, refreshToken, profile, done) {
      console.log('profile: ', profile);
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
    function authLogin(accessToken, refreshToken, profile, done) {
      console.log('profile: ', profile);
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
    res.redirect('/');
  },
);

userRoutes.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

userRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

export default userRoutes;
