import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateUserPermissionsService from '../services/createUserPermissionsService';

const permissionRoutes = Router();

permissionRoutes.post('/', ensureAuthenticated, async (req, res) => {
  const { userProviderId, notificationToken, instagramToken } = req.body;

  const createUserPermissionsService = new CreateUserPermissionsService();

  await createUserPermissionsService.execute({
    userProviderId,
    notificationToken,
    instagramToken,
  });

  return res.status(200).json({});
});

export default permissionRoutes;
