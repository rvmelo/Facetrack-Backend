import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

interface Request {
  userData: IUser;
}

class UpdateUserService {
  public async execute({ userData }: Request): Promise<IUser | null> {
    const user = await User.findOne({
      userProviderId: userData.userProviderId,
    }).exec();

    if (!user) throw new AppError('user does not exist', 401);

    Object.assign(user, userData);

    const savedUser = await user.save();

    return savedUser;
  }
}

export default UpdateUserService;
