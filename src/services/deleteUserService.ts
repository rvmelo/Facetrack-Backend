import fs from 'fs';
import path from 'path';

import AppError from '../errors/appError';
import User, { IUser } from '../models/User';

import uploadConfig from '../config/upload';

interface IRequest {
  userProviderId: string;
}

class DeleteUserService {
  public async execute({ userProviderId }: IRequest): Promise<IUser> {
    const foundUser = await User.findOneAndDelete({ userProviderId }).exec();

    if (!foundUser) throw new AppError('User does not exist');

    if (foundUser.avatar) {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        foundUser.avatar,
      );

      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    return foundUser;
  }
}

export default DeleteUserService;
