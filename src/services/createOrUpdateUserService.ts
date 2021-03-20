import { getMongoRepository, MongoRepository } from 'typeorm';
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
