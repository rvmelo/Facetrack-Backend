import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import RateUserService from '../services/rateUserService';
import SendRateNotificationService from '../services/sendRateNotificationService';

const evaluationRoutes = Router();

evaluationRoutes.patch('/', ensureAuthenticated, async (req, res) => {
  const rateUserService = new RateUserService();
  const sendRateNotificationService = new SendRateNotificationService();

  const { toUserId, value } = req.query;

  await rateUserService.execute({
    fromUserProviderId: req.user.id,
    toUserProviderId: typeof toUserId === 'string' ? toUserId : '',
    value: typeof value === 'string' ? value : '',
  });

  await sendRateNotificationService.execute({
    fromUserProviderId: req.user.id,
    toUserProviderId: typeof toUserId === 'string' ? toUserId : '',
    value: typeof value === 'string' ? value : '',
  });

  return res.status(200);
});

export default evaluationRoutes;
