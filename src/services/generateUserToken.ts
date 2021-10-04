import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import FindUserService from './findUserService';

interface IRequest {
  userProviderId: string;
}

class GenerateUserToken {
  public async execute({ userProviderId }: IRequest): Promise<string> {
    const findUserService = new FindUserService();

    const foundUser = await findUserService.execute({ userProviderId });

    const { secret, secretForNonRegisteredUsers, expiresIn } = authConfig.jwt;

    if (foundUser) {
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
