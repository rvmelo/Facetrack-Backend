export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    secretForNonRegisteredUsers:
      process.env.APP_SECRET_FOR_NOT_REGISTERED_USERS || 'default',
    expiresIn: '30d',
    signUpExpiresIn: 60 * 15,
  },
};
