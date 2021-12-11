import { Expo } from 'expo-server-sdk';
import AppError from '../errors/appError';

import UserPermissions from '../models/UserPermissions';

import FindUserService from './findUserService';

interface IRequest {
  userProviderId: string;
  notificationToken: string;
}

class CreateNotificationTokenService {
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

    const foundPermission = await UserPermissions.findOne({
      userProviderId,
    }).exec();

    if (foundPermission) {
      foundPermission.notificationToken = notificationToken;
      await foundPermission.save();
      return;
    }

    const createdPermission = new UserPermissions({
      userProviderId,
      notificationToken,
    });

    await createdPermission.save();
  }
}

export default CreateNotificationTokenService;
