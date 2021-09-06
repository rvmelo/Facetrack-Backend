/* eslint-disable radix */
import { getMongoRepository, MongoRepository } from 'typeorm';
import { classToClass } from 'class-transformer';
import User from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string;
  page: string;
}

class FindUsersService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({
    page,
    userProviderId,
  }: IRequest): Promise<User[] | undefined> {
    if (parseInt(page) < 1) {
      throw new AppError('Invalid page number');
    }

    const items_per_page = 2;

    const foundUsers = await this.ormRepository.find({
      skip: (parseInt(page) - 1) * items_per_page,
      take: items_per_page,
      order: {
        created_at: 'DESC',
      },
      where: { userProviderId: { $not: { $in: [userProviderId] } } },
    });

    const formattedUsers = foundUsers.map(foundUser => classToClass(foundUser));

    return classToClass(formattedUsers);
  }
}

export default FindUsersService;
