import User, { IUser } from '../models/User';

interface IRequest {
  query: string;
}

class SearchUsersService {
  public async execute({ query }: IRequest): Promise<IUser[]> {
    User.createIndexes([{ name: 1 }, { 'instagram.userName': 1 }]);

    const foundUsers = await User.find({
      $or: [
        {
          name: { $regex: query, $options: 'i' },
        },
        {
          'instagram.userName': { $regex: query, $options: 'i' },
        },
      ],
    }).exec();

    return foundUsers;
  }
}

export default SearchUsersService;
