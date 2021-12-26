import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import AppError from '../errors/appError';

import UserPermissions from '../models/UserPermissions';

import FindUserService from './findUserService';

interface IRequest {
  fromUserProviderId: string;
  toUserProviderId: string;
  value: number;
}

interface PushNotificationProps {
  expoPushToken: string;
  userName: string;
  value: number;
  fromUserProviderId: string;
  toUserProviderId: string;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification({
  expoPushToken,
  userName,
  value,
  fromUserProviderId,
  toUserProviderId,
}: PushNotificationProps) {
  const message: ExpoPushMessage = {
    to: expoPushToken,
    priority: 'high',
    title: 'You have been rated!!',
    body: `${userName} has rated you with ${value} stars!!`,
    data: { fromUserProviderId, toUserProviderId },
  };

  const expo = new Expo();

  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new AppError(
      `Push token ${expoPushToken} is not a valid Expo push token`,
      500,
    );
  }

  const tickets = await expo.sendPushNotificationsAsync([message]);

  if (tickets[0].status === 'error') {
    const { message: errorMessage } = tickets[0] || {};

    throw new AppError(errorMessage, 500);
  }
}

class SendRateNotificationService {
  public async execute({
    toUserProviderId,
    fromUserProviderId,
    value,
  }: IRequest): Promise<void> {
    const findUserService = new FindUserService();

    const fromUser = await findUserService.execute({
      userProviderId: fromUserProviderId,
    });

    const toUser = await findUserService.execute({
      userProviderId: toUserProviderId,
    });

    if (!fromUser || !toUser) {
      throw new AppError('User not found');
    }

    const userPermissions = await UserPermissions.findOne({
      userProviderId: toUserProviderId,
    }).exec();

    if (!userPermissions) {
      throw new AppError('No notification token found');
    }

    const { notificationToken } = userPermissions;

    const { name } = fromUser;

    await sendPushNotification({
      userName: name,
      value,
      expoPushToken: notificationToken,
      fromUserProviderId,
      toUserProviderId,
    });
  }
}

export default SendRateNotificationService;
