import { getMongoRepository, MongoRepository } from 'typeorm';
import User from '../models/User';

interface IRequest {
  id: string;
}

class FindUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ id }: IRequest): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({
      where: { user_id: id },
    });

    return foundUser;
  }
}

export default FindUserService;
