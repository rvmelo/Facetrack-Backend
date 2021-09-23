/* eslint-disable radix */
import { getMongoRepository, MongoRepository } from 'typeorm';
import { classToClass } from 'class-transformer';
import Evaluation from '../models/Evaluation';
import AppError from '../errors/appError';
import FindUserService from './findUserService';

interface IRequest {
  userProviderId: string | undefined;
  page: string | undefined;
}

class FindEvaluationsService {
  private ormRepository: MongoRepository<Evaluation>;

  constructor() {
    this.ormRepository = getMongoRepository(Evaluation, 'mongo');
  }

  public async execute({
    page,
    userProviderId,
  }: IRequest): Promise<Evaluation[] | undefined> {
    const findUserService = new FindUserService();

    if (!userProviderId || !page) {
      throw new AppError('Invalid data');
    }

    const foundUser = await findUserService.execute({
      userProviderId,
    });

    if (!foundUser) {
      throw new AppError('User not found');
    }

    if (parseInt(page) < 1) {
      throw new AppError('Invalid page number');
    }

    const items_per_page = 2;

    const foundEvaluations = await this.ormRepository.find({
      skip: (parseInt(page) - 1) * items_per_page,
      take: items_per_page,
      order: {
        created_at: 'DESC',
      },
      where: { toUserId: userProviderId },
    });

    const formattedEvaluations = foundEvaluations.map(foundEvaluation =>
      classToClass(foundEvaluation),
    );

    return classToClass(formattedEvaluations);
  }
}

export default FindEvaluationsService;
