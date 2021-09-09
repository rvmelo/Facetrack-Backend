import { getMongoRepository, MongoRepository } from 'typeorm';
import { Expo } from 'expo-server-sdk';
import AppError from '../errors/appError';

import UserPermissions from '../models/UserPermissions';

import FindUserService from './findUserService';

interface IRequest {
  userProviderId: string;
  notificationToken: string;
}

class CreateNotificationTokenService {
  private ormRepository: MongoRepository<UserPermissions>;

  constructor() {
    this.ormRepository = getMongoRepository(UserPermissions, 'mongo');
  }

  public async execute({
    userProviderId,
    notificationToken,
  }: IRequest): Promise<void> {
    const findUserService = new FindUserService();

    const user = await findUserService.execute({
      userProviderId,
    });

    if (!user) {
      throw new AppError('User not found');
    }

    if (!Expo.isExpoPushToken(notificationToken)) {
      throw new AppError(
        `Push token ${notificationToken} is not a valid Expo push token`,
      );
    }

    const foundPermission = await this.ormRepository.findOne({
      where: {
        userProviderId,
      },
    });

    if (foundPermission) {
      await this.ormRepository.save({
        ...foundPermission,
        userProviderId,
        notificationToken,
      });
      return;
    }

    const createdPermission = this.ormRepository.create({
      userProviderId,
      notificationToken,
    });
    await this.ormRepository.save(createdPermission);
  }
}

export default CreateNotificationTokenService;
