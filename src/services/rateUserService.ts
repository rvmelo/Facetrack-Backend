/* eslint-disable radix */
import Evaluation from '../models/Evaluation';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  fromUserProviderId: string;
  toUserProviderId: string;
  value: number;
  message: string | undefined;
}

class RateUserService {
  public async execute({
    fromUserProviderId,
    toUserProviderId,
    value,
    message,
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

    if (!value) {
      throw new AppError('Value is required');
    }

    if (value < 1 || value > 5) {
      throw new AppError('Invalid value');
    }

    const foundEvaluation = await Evaluation.findOne()
      .where('fromUserId')
      .equals(fromUser)
      .where('toUserId')
      .equals(toUser)
      .exec();

    const requestData = message
      ? { value, message, updated_at: Date.now() }
      : { value, updated_at: Date.now() };

    if (foundEvaluation) {
      Object.assign(foundEvaluation, {
        ...foundEvaluation,
        ...requestData,
      });

      await foundEvaluation?.save();

      return;
    }

    const newEvaluation = new Evaluation({
      fromUserId: fromUser,
      toUserId: toUser,
      ...requestData,
    });

    await newEvaluation.save();
  }
}

export default RateUserService;
