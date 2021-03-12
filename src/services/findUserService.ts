import { getMongoRepository, MongoRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import User from '../models/User';

interface IRequest {
  id: string;
  displayName: string;
}

interface IResponse {
  registeredUser?: User | undefined;
  notRegisteredUser?: {
    id: string;
    displayName: string;
  };
  token: string;
}

class FindUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ id, displayName }: IRequest): Promise<IResponse> {
    const foundUser = await this.ormRepository.findOne({
      where: { user_id: id },
    });

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: id,
      expiresIn,
    });

    return foundUser
      ? { registeredUser: foundUser, token }
      : { notRegisteredUser: { id, displayName }, token };
  }
}

export default FindUserService;
