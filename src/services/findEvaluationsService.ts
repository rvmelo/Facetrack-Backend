/* eslint-disable radix */
import Evaluation, { IEvaluation } from '../models/Evaluation';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string | undefined;
  page: string | undefined;
}

class FindEvaluationsService {
  public async execute({
    page,
    userProviderId,
  }: IRequest): Promise<IEvaluation[] | undefined> {
    if (!userProviderId || !page) {
      throw new AppError('Invalid data');
    }

    const foundUser = await User.findOne({ userProviderId }).exec();

    if (!foundUser) {
      throw new AppError('User not found');
    }

    if (parseInt(page) < 1) {
      throw new AppError('Invalid page number');
    }

    const items_per_page = 2;

    const foundEvaluations = await Evaluation.find()
      .sort({ updated_at: 'desc' })
      .where('toUserId')
      .equals(foundUser)
      .populate('fromUserId', 'name userProviderId')
      .skip((parseInt(page) - 1) * items_per_page)
      .limit(items_per_page)
      .exec();

    return foundEvaluations;
  }
}

export default FindEvaluationsService;
