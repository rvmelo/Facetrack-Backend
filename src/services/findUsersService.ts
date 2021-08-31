/* eslint-disable radix */
import { getMongoRepository, MongoRepository } from 'typeorm';
import { classToClass } from 'class-transformer';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  page: string;
}

class FindUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ page }: IRequest): Promise<User[] | undefined> {
    if (parseInt(page) < 0) {
      throw new AppError('Invalid page number');
    }

    const foundUsers = await this.ormRepository.find({
      skip: parseInt(page) - 1,
      take: 2,
    });

    const formattedUsers = foundUsers.map(foundUser => classToClass(foundUser));

    return classToClass(formattedUsers);
  }
}

export default FindUserService;
