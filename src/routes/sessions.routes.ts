import { Router } from 'express';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import FindUserService from '../services/findUserService';
import GenerateUserToken from '../services/generateUserToken';
import GetUserInstagramDataService from '../services/getUserInstagramDataService';

interface AuthData {
  notRegisteredUser?: {
    userProviderId: string;
    name: string;
  };
  token: string;
}

let userData = {} as AuthData;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/sessions/auth/facebook/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      const findUserService = new FindUserService();
      const generateUserToken = new GenerateUserToken();

      const { id, displayName } = profile;

      const token = await generateUserToken.execute({ userProviderId: id });

      const foundUser = await findUserService.execute({
        userProviderId: id,
      });

      userData = foundUser
        ? { token }
        : {
            notRegisteredUser: { userProviderId: id, name: displayName },
            token,
          };

      return done(null, profile);
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BASE_URL}/sessions/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const findUserService = new FindUserService();
      const generateUserToken = new GenerateUserToken();

      const { id, displayName } = profile;

      const token = await generateUserToken.execute({ userProviderId: id });

      const foundUser = await findUserService.execute({
        userProviderId: id,
      });

      userData = foundUser
        ? { token }
        : {
            notRegisteredUser: { userProviderId: id, name: displayName },
            token,
          };

      return done('', profile);
    },
  ),
);

const sessionRoutes = Router();

sessionRoutes.get('/auth/facebook', passport.authenticate('facebook'));

sessionRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect(
      `${process.env.EXPO_CLIENT_URL}?authData=${JSON.stringify(userData)}`,
    );
  },
);

sessionRoutes.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

sessionRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(
      `${process.env.EXPO_CLIENT_URL}?authData=${JSON.stringify(userData)}`,
    );
  },
);

sessionRoutes.get('/auth/instagram/callback', async (req, res) => {
  const { code } = req.query;

  res.redirect(`${process.env.EXPO_CLIENT_URL}?code=${code}`);
});

sessionRoutes.get('/auth/instagram/profile', async (req, res) => {
  const { code } = req.query;

  const getUserInstagramDataService = new GetUserInstagramDataService();

  const instagramData = await getUserInstagramDataService.execute({
    authCode: typeof code === 'string' ? code : '',
  });

  res.status(200).json(instagramData);
});

export default sessionRoutes;
