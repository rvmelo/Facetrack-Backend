import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import CreateOrUpdateUserService from '../services/createOrUpdateUserService';
import FindUserService from '../services/findUserService';

import ensureSignUp from '../middlewares/ensureSignUp';

const userRoutes = Router();

const mediaSchema = Joi.object().keys({
  id: Joi.string().trim().required(),
  caption: Joi.string().trim(),
  media_url: Joi.string().trim().uri().required(),
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

    const createOrUpdateUserService = new CreateOrUpdateUserService();

    const savedUser = await createOrUpdateUserService.execute({ user });

    return res.status(200).json(savedUser);
  },
);

userRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;

  const findUserService = new FindUserService();

  const userData = await findUserService.execute({ userProviderId: id });

  return res.status(200).json(userData);
});

export default userRoutes;
