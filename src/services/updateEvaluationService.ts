/* eslint-disable radix */
import Evaluation from '../models/Evaluation';
import AppError from '../errors/appError';

interface IRequest {
  evaluationId: string;
}

class UpdateEvaluationService {
  public async execute({ evaluationId }: IRequest): Promise<void> {
    const foundEvaluation = await Evaluation.findById(evaluationId).exec();

    if (!foundEvaluation) {
      throw new AppError('No evaluation found');
    }

    //  if user has seen this evaluation which arrives as a notification
    Object.assign(foundEvaluation, { isRead: true });

    await foundEvaluation.save();
  }
}

export default UpdateEvaluationService;
