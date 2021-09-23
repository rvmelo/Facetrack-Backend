import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

import uploadConfig from '../config/upload';

interface Request {
  userProviderId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({
    userProviderId,
    avatarFileName,
  }: Request): Promise<IUser> {
    const user = await User.findOne({ userProviderId }).exec();

    if (!user) throw new AppError('can not change user avatar', 401);

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    const avatarPath = path.join(
      __dirname,
      '..',
      '..',
      `tmp/${avatarFileName}`,
    );

    const resizedFile = `resized-${avatarFileName}`;

    await sharp(avatarPath)
      .resize({ width: 640, height: 640 })
      .toFile(path.join(__dirname, '..', '..', `tmp/${resizedFile}`));

    await fs.promises.unlink(avatarPath);

    user.avatar = resizedFile;
    const savedUser = await user.save();

    return savedUser;
  }
}

export default UpdateUserAvatarService;
