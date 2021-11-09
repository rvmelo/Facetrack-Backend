import User, { IUser } from '../models/User';

interface IRequest {
  query: string;
}

class SearchUsersService {
  public async execute({ query }: IRequest): Promise<IUser[]> {
    User.createIndexes([{ name: 1 }, { 'instagram.userName': 1 }]);

    const maximum_amount = 30;

    const foundUsers = await User.find({
      $or: [
        {
          name: { $regex: query, $options: 'i' },
        },
        {
          'instagram.userName': { $regex: query, $options: 'i' },
        },
      ],
    })
      .limit(maximum_amount)
      .exec();

    return foundUsers;
  }
}

export default SearchUsersService;
