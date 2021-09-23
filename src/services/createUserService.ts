import { isValid, differenceInYears, endOfDay } from 'date-fns';

import AppError from '../errors/appError';
import User, { IUser } from '../models/User';

interface IRequest {
  user: IUser;
}

class CreateUserService {
  public async execute({ user }: IRequest): Promise<IUser> {
    const { birthDate } = user;

    const currentDate = endOfDay(new Date());

    if (!isValid(birthDate) || !birthDate) {
      throw new AppError('Invalid date');
    }

    if (differenceInYears(currentDate, new Date(birthDate)) < 18) {
      throw new AppError('User is under age');
    }

    const foundUser = await User.findOne({
      userProviderId: user.userProviderId,
    }).exec();

    if (foundUser) throw new AppError('User already exists');

    const createdUser = new User({ ...user });
    const savedUser = await createdUser.save();

    return savedUser;
  }
}

export default CreateUserService;
