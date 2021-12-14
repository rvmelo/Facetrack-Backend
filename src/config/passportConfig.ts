import { PassportStatic } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import FindUserService from '../services/findUserService';
import GenerateUserToken from '../services/generateUserToken';

export const handlePassportConfig = (passport: PassportStatic): void => {
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

        const user = foundUser
          ? { registeredUser: foundUser, token }
          : {
              notRegisteredUser: { userProviderId: id, name: displayName },
              token,
            };

        done(null, user);
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

        const user = foundUser
          ? { registeredUser: foundUser, token }
          : {
              notRegisteredUser: { userProviderId: id, name: displayName },
              token,
            };

        done(null, user);
      },
    ),
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser(
    (user: false | Express.User | null | undefined, cb) => {
      cb(null, user);
    },
  );
};
