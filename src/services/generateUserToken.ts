import { getMongoRepository, MongoRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import User from '../models/User';

interface IRequest {
  userProviderId: string;
}

class GenerateUserToken {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ userProviderId }: IRequest): Promise<string> {
    const foundUser = await this.ormRepository.findOne({
      where: { userProviderId },
    });

    const { secret, secretForNonRegisteredUsers, expiresIn } = authConfig.jwt;

    if (!foundUser) {
      const token = sign({}, secret, {
        subject: userProviderId,
        expiresIn,
      });

      return token;
    }

    const token = sign({}, secretForNonRegisteredUsers, {
      subject: userProviderId,
      expiresIn,
    });

    return token;
  }
}

export default GenerateUserToken;
