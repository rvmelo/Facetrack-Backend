import { getMongoRepository, MongoRepository } from 'typeorm';
import { classToClass } from 'class-transformer';
import User from '../models/User';

interface IRequest {
  userProviderId: string;
}

class FindUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({
    userProviderId,
  }: IRequest): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({
      where: { userProviderId },
    });

    return classToClass(foundUser);
  }
}

export default FindUserService;
