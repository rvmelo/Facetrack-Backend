import { Router } from 'express';

import passport from 'passport';
import { handlePassportConfig } from '../config/passportConfig';

import GetUserInstagramDataService from '../services/getUserInstagramDataService';

interface NotRegisteredUser {
  userProviderId: string;
  name: string;
}

type AuthData = {
  notRegisteredUser?: NotRegisteredUser;
  token: string;
};

const sessionRoutes = Router();

sessionRoutes.use(passport.initialize());
sessionRoutes.use(passport.session());
handlePassportConfig(passport);

sessionRoutes.get('/auth/success', (req, res) => {
  const { notRegisteredUser, token } = (req?.user as AuthData) || {};

  return res.redirect(
    `${process.env.EXPO_CLIENT_URL}?notRegisteredUser=${JSON.stringify(
      notRegisteredUser,
    )}&token=${token}`,
  );
});

sessionRoutes.get('/auth/facebook', passport.authenticate('facebook'));

sessionRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.BASE_URL}/sessions/auth/success`,
  }),
);

sessionRoutes.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);

sessionRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.BASE_URL}/sessions/auth/success`,
  }),
);

sessionRoutes.get('/auth/instagram/callback', async (req, res) => {
  const { code } = req.query;

  return res.redirect(`${process.env.EXPO_CLIENT_URL}?code=${code}`);
});

sessionRoutes.get('/auth/instagram/profile', async (req, res) => {
  const { code } = req.query;

  const getUserInstagramDataService = new GetUserInstagramDataService();

  const instagramData = await getUserInstagramDataService.execute({
    authCode: typeof code === 'string' ? code : '',
  });

  return res.status(200).json(instagramData);
});

export default sessionRoutes;
