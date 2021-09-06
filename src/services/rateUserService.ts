/* eslint-disable radix */
import { getMongoRepository, MongoRepository } from 'typeorm';
import Evaluation from '../models/Evaluation';
import AppError from '../errors/appError';
import FindUserService from './findUserService';

interface IRequest {
  fromUserProviderId: string;
  toUserProviderId: string;
  value: string;
}

class RateUserService {
  private ormRepository: MongoRepository<Evaluation>;

  constructor() {
    this.ormRepository = getMongoRepository(Evaluation, 'mongo');
  }

  public async execute({
    fromUserProviderId,
    toUserProviderId,
    value,
  }: IRequest): Promise<void> {
    const findUserService = new FindUserService();

    const foundUser = await findUserService.execute({
      userProviderId: fromUserProviderId,
    });

    if (!foundUser) {
      throw new AppError('User not found');
    }

    const parsedValue = parseInt(value);

    if (parsedValue < 1 || parsedValue > 5) {
      throw new AppError('Invalid value');
    }

    const foundEvaluation = await this.ormRepository.findOne({
      where: {
        fromUserId: { $eq: fromUserProviderId },
        toUserId: { $eq: toUserProviderId },
      },
    });

    if (foundEvaluation) {
      await this.ormRepository.save({ ...foundEvaluation, value: parsedValue });
      return;
    }

    const createdEvaluation = this.ormRepository.create({
      fromUserId: fromUserProviderId,
      toUserId: toUserProviderId,
      value: parsedValue,
    });

    await this.ormRepository.save(createdEvaluation);
  }
}

export default RateUserService;
