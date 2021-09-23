/* eslint-disable radix */
import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string;
  page: string;
}

class FindUsersService {
  public async execute({
    page,
    userProviderId,
  }: IRequest): Promise<IUser[] | undefined> {
    if (parseInt(page) < 1) {
      throw new AppError('Invalid page number');
    }

    const items_per_page = 2;

    const foundUsers = await User.find({
      userProviderId: { $ne: userProviderId },
    })
      .skip((parseInt(page) - 1) * items_per_page)
      .limit(items_per_page)
      .exec();

    return foundUsers;
  }
}

export default FindUsersService;
