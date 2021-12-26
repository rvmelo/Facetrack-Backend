import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';

import CreateUserService from '../services/createUserService';
import DeleteUserService from '../services/deleteUserService';
import GenerateUserToken from '../services/generateUserToken';
import UpdateUserService from '../services/updateUserService';
import FindUsersService from '../services/findUsersService';
import FindUserService from '../services/findUserService';
import UpdateUserLocationService from '../services/updateUserLocationService';
import TrackUsersService from '../services/trackUsersService';
import SearchUsersService from '../services/searchUsersService';
import UpdateUserRateService from '../services/updateUserRateService';

import ensureSignUp from '../middlewares/ensureSignUp';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { instagramRateLimiter } from '../middlewares/rateLimiters';

import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/updateUserAvatarService';
import RefreshUserInstagramDataService from '../services/refreshUserInstagramDataService';

const userRoutes = Router();
const upload = multer(uploadConfig);

const mediaSchema = Joi.object().keys({
  id: Joi.string().trim().required(),
  caption: Joi.string().trim(),
  media_url: Joi.string().trim().uri().required(),
  media_type: Joi.string().trim().required(),
  timestamp: Joi.string().trim().required(),
});

const userValidation = celebrate({
  [Segments.BODY]: {
    _id: Joi.string(),
    userProviderId: Joi.string().required(),
    name: Joi.string().trim().min(3).required(),
    avatar: Joi.string().trim().allow(null, ''),
    rate: Joi.number(),
    birthDate: Joi.date().required(),
    sex: Joi.string().valid('male', 'female').required(),
    relationshipStatus: Joi.string()
      .valid('single', 'serious relationship', 'married')
      .required(),
    sexualOrientation: Joi.string()
      .valid('heterosexual', 'homosexual', 'bisexual', 'asexual')
      .required(),
    instagram: Joi.object().keys({
      userName: Joi.string().required(),
      userMedia: Joi.array().items(mediaSchema),
    }),
    location: Joi.object(),
    created_at: Joi.date(),
    updated_at: Joi.date(),
    __v: Joi.number(),
  },
});

userRoutes.get(
  '/instagram',
  ensureAuthenticated,
  instagramRateLimiter,
  async (req, res) => {
    //  only reading permissions for instagram
    const { token } = req.query;
    // const { token } = req.headers.authorization;

    const refreshUserInstagramDataService =
      new RefreshUserInstagramDataService();

    const instagramData = await refreshUserInstagramDataService.execute({
      userProviderId: req.user.id,
      token: typeof token === 'string' ? token : '',
    });

    return res.status(200).json(instagramData);
  },
);

userRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateAvatarService = new UpdateUserAvatarService();

    const user = await updateAvatarService.execute({
      userProviderId: req.user.id,
      avatarFileName: req.file ? req.file.filename : '',
    });

    return res.status(200).json(user);
  },
);

userRoutes.patch('/update-location', ensureAuthenticated, async (req, res) => {
  const updateUserLocationService = new UpdateUserLocationService();

  const { coords } = req.body;

  const userProviderId = req.user.id;

  const updatedUser = await updateUserLocationService.execute({
    userProviderId,
    coords,
  });

  return res.status(200).json(updatedUser);
});

userRoutes.get('/search-user', ensureAuthenticated, async (req, res) => {
  const searchUsersService = new SearchUsersService();

  const { query } = req.query;

  const foundUsers = await searchUsersService.execute({
    query: typeof query === 'string' ? query.trim() : '',
  });

  return res.status(200).json(foundUsers);
});

userRoutes.get('/track-user', ensureAuthenticated, async (req, res) => {
  const trackUsersService = new TrackUsersService();

  const { distance, page } = req.query;

  const userProviderId = req.user.id;

  const foundUsers = await trackUsersService.execute({
    userProviderId,
    distance: typeof distance === 'string' ? distance : '',
    page: typeof page === 'string' ? page : '',
  });

  return res.status(200).json(foundUsers);
});

userRoutes.get(
  '/update-rate/:userProviderId',
  ensureAuthenticated,
  async (req, res) => {
    const updateUserRateService = new UpdateUserRateService();

    const { userProviderId } = req.params;

    const rate = await updateUserRateService.execute({
      userProviderId,
    });

    return res.status(200).json({ rate });
  },
);

userRoutes.patch('/', ensureAuthenticated, async (req, res) => {
  const updateUserService = new UpdateUserService();

  const userData = req.body;

  const userProviderId = req.user.id;

  const updatedUser = await updateUserService.execute({
    userData: { ...userData, userProviderId },
  });

  return res.json(updatedUser);
});

userRoutes.get('/me', ensureAuthenticated, async (req, res) => {
  const findUserService = new FindUserService();
  const foundUser = await findUserService.execute({
    userProviderId: req.user.id,
  });

  return res.status(200).json(foundUser);
});

userRoutes.get('/:userProviderId', ensureAuthenticated, async (req, res) => {
  const { userProviderId } = req.params;

  const findUserService = new FindUserService();
  const foundUser = await findUserService.execute({ userProviderId });

  return res.status(200).json(foundUser);
});

userRoutes.get('/', ensureAuthenticated, async (req, res) => {
  const findUsersService = new FindUsersService();
  const foundUsers = await findUsersService.execute({
    userProviderId: req.user.id,
  });

  return res.status(200).json(foundUsers);
});

userRoutes.post('/', ensureSignUp, userValidation, async (req, res) => {
  const user = req.body;

  const createUserService = new CreateUserService();
  const generateUserToken = new GenerateUserToken();

  const savedUser = await createUserService.execute({ user });
  const token = await generateUserToken.execute({
    userProviderId: savedUser.userProviderId,
  });

  return res.status(200).json({ user: savedUser, token });
});

userRoutes.delete('/', ensureAuthenticated, async (req, res) => {
  const deleteUserService = new DeleteUserService();

  const deletedUser = await deleteUserService.execute({
    userProviderId: req.user.id,
  });

  return res.status(200).json({ user: deletedUser });
});

export default userRoutes;
