import { getMongoRepository, MongoRepository } from 'typeorm';
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

    return foundUser;
  }
}

export default FindUserService;
