/* eslint-disable radix */
import User, { IUser } from '../models/User';

interface IRequest {
  userProviderId: string;
}

class FindUsersService {
  public async execute({
    userProviderId,
  }: IRequest): Promise<IUser[] | undefined> {
    const items_per_page = 2;

    const count = await User.find({ userProviderId: { $ne: userProviderId } })
      .count()
      .exec();

    const randomValue = Math.floor(Math.random() * count);

    const foundUsers = await User.find({
      userProviderId: { $ne: userProviderId },
    })
      .skip(randomValue)
      .limit(items_per_page)
      .exec();

    return foundUsers;
  }
}

export default FindUsersService;
