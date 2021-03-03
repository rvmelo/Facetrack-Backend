import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import cors from 'cors';

import routes from './routes';

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

app.use(routes);

app.listen(3333, () => console.log('server started at port 3333'));
