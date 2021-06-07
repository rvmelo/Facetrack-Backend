import { getMongoRepository, MongoRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import { classToClass } from 'class-transformer';

import AppError from '../errors/appError';
import User from '../models/User';

import uploadConfig from '../config/upload';

interface IRequest {
  userProviderId: string;
}

class DeleteUserService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({ userProviderId }: IRequest): Promise<User> {
    const foundUser = await this.ormRepository.findOne({
      where: { userProviderId },
    });

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

    await this.ormRepository.delete(foundUser);

    return classToClass(foundUser);
  }
}

export default DeleteUserService;
