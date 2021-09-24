/* eslint-disable radix */
import Evaluation from '../models/Evaluation';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  fromUserProviderId: string;
  toUserProviderId: string;
  value: string;
}

class RateUserService {
  public async execute({
    fromUserProviderId,
    toUserProviderId,
    value,
  }: IRequest): Promise<void> {
    const fromUser = await User.findOne({
      userProviderId: fromUserProviderId,
    }).exec();

    const toUser = await User.findOne({
      userProviderId: toUserProviderId,
    }).exec();

    if (!fromUser || !toUser) {
      throw new AppError('User not found');
    }

    const parsedValue = parseInt(value);

    if (parsedValue < 1 || parsedValue > 5) {
      throw new AppError('Invalid value');
    }

    const foundEvaluation = await Evaluation.findOne()
      .where('fromUserId')
      .equals(fromUser)
      .where('toUserId')
      .equals(toUser)
      .exec();

    if (foundEvaluation) {
      Object.assign(foundEvaluation, {
        ...foundEvaluation,
        value,
        updated_at: Date.now(),
      });

      await foundEvaluation?.save();
      return;
    }

    const newEvaluation = new Evaluation({
      fromUserId: fromUser,
      toUserId: toUser,
      value,
    });

    await newEvaluation.save();
  }
}

export default RateUserService;
