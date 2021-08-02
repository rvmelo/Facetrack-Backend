import { getMongoRepository, MongoRepository } from 'typeorm';

import { classToClass } from 'class-transformer';
import User from '../models/User';
import AppError from '../errors/appError';

interface Request {
  userData: User;
}

class UpdateUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ userData }: Request): Promise<User> {
    const user = await this.ormRepository.findOne({
      where: {
        userProviderId: userData.userProviderId,
      },
    });

    if (!user) throw new AppError('user does not exist', 401);

    Object.assign(user, userData);

    await this.ormRepository.save(user);

    return classToClass(user);
  }
}

export default UpdateUserService;
