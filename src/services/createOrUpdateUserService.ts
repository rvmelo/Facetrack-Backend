import { getMongoRepository, MongoRepository } from 'typeorm';
import { isValid, differenceInYears, endOfDay } from 'date-fns';

import AppError from '../errors/appError';
import User from '../models/User';

interface IRequest {
  user: User;
}

class CreateOrUpdateUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ user }: IRequest): Promise<User> {
    const { birthDate } = user;

    const currentDate = endOfDay(new Date());

    if (!isValid(birthDate)) {
      throw new AppError('Invalid date');
    }

    if (differenceInYears(currentDate, birthDate) < 18) {
      throw new AppError('User is under age');
    }

    const foundUser = await this.ormRepository.findOne({
      where: {
        userProviderId: user.userProviderId,
      },
    });

    if (!foundUser) {
      const createdUser = this.ormRepository.create(user);
      await this.ormRepository.save(createdUser);
      return createdUser;
    }

    const updatedUser = await this.ormRepository.save(foundUser);

    return updatedUser;
  }
}

export default CreateOrUpdateUserService;
