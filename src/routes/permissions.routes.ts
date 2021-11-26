import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateNotificationTokenService from '../services/createNotificationTokenService';

const permissionRoutes = Router();

permissionRoutes.post('/', ensureAuthenticated, async (req, res) => {
  const { userProviderId, notificationToken } = req.body;

  const createNotificationTokenService = new CreateNotificationTokenService();

  await createNotificationTokenService.execute({
    userProviderId,
    notificationToken,
  });

  return res.status(200).json({});
});

export default permissionRoutes;
