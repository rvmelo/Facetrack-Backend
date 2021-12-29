import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import RateUserService from '../services/rateUserService';
import SendRateNotificationService from '../services/sendRateNotificationService';
import FindEvaluationsService from '../services/findEvaluationsService';
import UpdateEvaluationService from '../services/updateEvaluationService';

const evaluationRoutes = Router();

evaluationRoutes.post('/', ensureAuthenticated, async (req, res) => {
  const rateUserService = new RateUserService();
  const sendRateNotificationService = new SendRateNotificationService();

  const { toUserId, value, message } = req.body;

  await rateUserService.execute({
    fromUserProviderId: req.user.id,
    toUserProviderId: typeof toUserId === 'string' ? toUserId : '',
    message,
    value,
  });

  await sendRateNotificationService.execute({
    fromUserProviderId: req.user.id,
    toUserProviderId: typeof toUserId === 'string' ? toUserId : '',
    value,
    message,
  });

  return res.status(200).json({});
});

evaluationRoutes.get(
  '/received/:userProviderId',
  ensureAuthenticated,
  async (req, res) => {
    const { page } = req.query;
    const { userProviderId } = req.params;

    const findEvaluationsService = new FindEvaluationsService();

    const foundEvaluations = await findEvaluationsService.execute({
      userProviderId,
      page: typeof page === 'string' ? page : '1',
    });

    return res.status(200).json({ foundEvaluations });
  },
);

evaluationRoutes.patch(
  '/update/:evaluationId',
  ensureAuthenticated,
  async (req, res) => {
    const { evaluationId } = req.params;

    const updateEvaluationService = new UpdateEvaluationService();

    await updateEvaluationService.execute({ evaluationId });

    return res.status(200).json({});
  },
);

export default evaluationRoutes;
