import { getMongoRepository, MongoRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import User from '../models/User';

interface IRequest {
  id: string;
}

interface IResponse {
  user: User | undefined;
  token: string;
}

class FindUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ id }: IRequest): Promise<IResponse> {
    const foundUser = await this.ormRepository.findOne({
      where: { user_id: id },
    });

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: id,
      expiresIn,
    });

    return { user: foundUser, token };
  }
}

export default FindUserService;
