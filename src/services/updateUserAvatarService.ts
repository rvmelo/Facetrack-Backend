import { getMongoRepository, MongoRepository } from 'typeorm';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import AppError from '../errors/appError';

import uploadConfig from '../config/upload';

interface Request {
  userProviderId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({
    userProviderId,
    avatarFileName,
  }: Request): Promise<User> {
    const user = await this.ormRepository.findOne({
      where: {
        userProviderId,
      },
    });

    if (!user) throw new AppError('can not change user avatar', 401);

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

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
    await this.ormRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
