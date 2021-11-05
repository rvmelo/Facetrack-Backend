import Evaluation, { IEvaluation } from '../models/Evaluation';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string | undefined;
  page: string;
}

class FindEvaluationsService {
  public async execute({
    userProviderId,
    page,
  }: IRequest): Promise<IEvaluation[] | undefined> {
    if (!userProviderId) {
      throw new AppError('Invalid data');
    }

    if (Object.is(NaN, parseInt(page, 10)) || parseInt(page, 10) < 1) {
      throw new AppError('Invalid page number');
    }

    const foundUser = await User.findOne({ userProviderId }).exec();

    if (!foundUser) {
      throw new AppError('User not found');
    }

    const items_per_page = 10;

    const foundEvaluations = await Evaluation.find()
      .sort({ updated_at: 'desc', _id: 1 })
      .where('toUserId')
      .equals(foundUser)
      .populate('fromUserId', 'name userProviderId avatar instagram.userName')
      .skip((parseInt(page, 10) - 1) * items_per_page)
      .limit(items_per_page)
      .exec();

    // const foundEvaluations = await Evaluation.find()
    //   .sort({ updated_at: 'desc' })
    //   .where('toUserId')
    //   .equals(foundUser)
    //   .populate('fromUserId', 'name userProviderId avatar instagram.userName')
    //   .limit(maximum_amount)
    //   .exec();

    return foundEvaluations;
  }
}

export default FindEvaluationsService;
