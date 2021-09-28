/* eslint-disable radix */
import Evaluation, { IEvaluation } from '../models/Evaluation';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string | undefined;
}

class FindEvaluationsService {
  public async execute({
    userProviderId,
  }: IRequest): Promise<IEvaluation[] | undefined> {
    if (!userProviderId) {
      throw new AppError('Invalid data');
    }

    const foundUser = await User.findOne({ userProviderId }).exec();

    if (!foundUser) {
      throw new AppError('User not found');
    }

    const maximum_amount = 2;

    // const foundEvaluations = await Evaluation.find()
    //   .sort({ updated_at: 'desc' })
    //   .where('toUserId')
    //   .equals(foundUser)
    //   .populate('fromUserId', 'name userProviderId avatar instagram.userName')
    //   .skip((parseInt(page) - 1) * items_per_page)
    //   .limit(items_per_page)
    //   .exec();

    const foundEvaluations = await Evaluation.find()
      .sort({ updated_at: 'desc' })
      .where('toUserId')
      .equals(foundUser)
      .populate('fromUserId', 'name userProviderId avatar instagram.userName')
      .limit(maximum_amount)
      .exec();

    return foundEvaluations;
  }
}

export default FindEvaluationsService;
