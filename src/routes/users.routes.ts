import { Router } from 'express';
import CreateOrUpdateUserService from '../services/createOrUpdateUserService';
import FindUserService from '../services/findUserService';

const userRoutes = Router();

userRoutes.post('/', async (req, res) => {
  const user = req.body;

  const createOrUpdateUserService = new CreateOrUpdateUserService();

  const savedUser = await createOrUpdateUserService.execute({ user });

  return res.status(200).json(savedUser);
});

userRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;

  const findUserService = new FindUserService();

  const userData = await findUserService.execute({ userProviderId: id });

  return res.status(200).json(userData);
});

export default userRoutes;
