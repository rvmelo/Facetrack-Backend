/* eslint-disable no-underscore-dangle */
import User from '../models/User';
import Evaluation from '../models/Evaluation';

import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string;
}

class UpdateUserRateService {
  public async execute({ userProviderId }: IRequest): Promise<number> {
    const user = await User.findOne({
      userProviderId,
    }).exec();

    if (!user) throw new AppError('user does not exist', 401);

    const result = await Evaluation.aggregate([
      { $match: { toUserId: user._id } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]).exec();

    const evaluationCount = await Evaluation.find()
      .where('toUserId')
      .equals(user)
      .count()
      .exec();

    const { total } = result[0] || {};

    if (!total) return 0;

    const rate = total / evaluationCount;

    user.rate = rate;

    await user.save();

    return rate;
  }
}

export default UpdateUserRateService;
