import { getMongoRepository, MongoRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import AppError from '../errors/appError';

import uploadConfig from '../config/upload';

interface Request {
  userProviderId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({
    userProviderId,
    avatarFilename,
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

    user.avatar = avatarFilename;
    await this.ormRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
