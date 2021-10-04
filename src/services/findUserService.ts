import User, { IUser } from '../models/User';

interface IRequest {
  userProviderId: string;
}

class FindUserService {
  public async execute({ userProviderId }: IRequest): Promise<IUser | null> {
    const foundUser = await User.findOne({ userProviderId }).exec();

    return foundUser;
  }
}

export default FindUserService;
