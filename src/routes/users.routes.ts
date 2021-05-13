import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import CreateUserService from '../services/createUserService';
import GenerateUserToken from '../services/generateUserToken';

import ensureSignUp from '../middlewares/ensureSignUp';

const userRoutes = Router();

const mediaSchema = Joi.object().keys({
  id: Joi.string().trim().required(),
  caption: Joi.string().trim(),
  media_url: Joi.string().trim().uri().required(),
  media_type: Joi.string().trim().required(),
  timestamp: Joi.string().trim().required(),
});

userRoutes.post(
  '/',
  ensureSignUp,
  celebrate({
    [Segments.BODY]: {
      userProviderId: Joi.string().required(),
      name: Joi.string().trim().min(3).required(),
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
    },
  }),
  async (req, res) => {
    const user = req.body;

    const createUserService = new CreateUserService();
    const generateUserToken = new GenerateUserToken();

    const savedUser = await createUserService.execute({ user });
    const token = await generateUserToken.execute({
      userProviderId: savedUser.userProviderId,
    });

    return res.status(200).json({ user: savedUser, token });
  },
);

export default userRoutes;
