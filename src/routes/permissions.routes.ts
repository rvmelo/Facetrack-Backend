import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateNotificationTokenService from '../services/createNotificationTokenService';

const permissionRoutes = Router();

permissionRoutes.post('/', ensureAuthenticated, async (req, res) => {
  const { userProviderId, notificationToken, instagramToken } = req.body;

  const createNotificationTokenService = new CreateNotificationTokenService();

  await createNotificationTokenService.execute({
    userProviderId,
    notificationToken,
    instagramToken,
  });

  return res.status(200).json({});
});

export default permissionRoutes;
