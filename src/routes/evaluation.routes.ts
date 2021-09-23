import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import RateUserService from '../services/rateUserService';
import SendRateNotificationService from '../services/sendRateNotificationService';
import FindEvaluationsService from '../services/findEvaluationsService';

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

evaluationRoutes.get('/', ensureAuthenticated, async (req, res) => {
  const findEvaluationsService = new FindEvaluationsService();

  const { page } = req.query;

  const foundEvaluations = await findEvaluationsService.execute({
    userProviderId: req.user.id,
    page: typeof page === 'string' ? page : '1',
  });

  return res.status(200).json({ foundEvaluations });
});

export default evaluationRoutes;
