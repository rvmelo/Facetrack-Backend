import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import AppError from '../errors/appError';

import UserPermissions from '../models/UserPermissions';

import FindUserService from './findUserService';

interface IRequest {
  fromUserProviderId: string;
  toUserProviderId: string;
  value: number;
  message: string;
}

interface PushNotificationProps {
  expoPushToken: string;
  userName: string;
  value: number;
  message: string;
  fromUserProviderId: string;
  toUserProviderId: string;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification({
  expoPushToken,
  userName,
  value,
  message,
  fromUserProviderId,
  toUserProviderId,
}: PushNotificationProps) {
  const notificationData: ExpoPushMessage = {
    to: expoPushToken,
    priority: 'high',
    title: `${userName} has rated you with ${value} stars!!`,
    body: `${message.substring(0, 35)}...`,
    data: { fromUserProviderId, toUserProviderId },
  };

  const expo = new Expo();

  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new AppError(
      `Push token ${expoPushToken} is not a valid Expo push token`,
      500,
    );
  }

  const tickets = await expo.sendPushNotificationsAsync([notificationData]);

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
    message,
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
      message,
      expoPushToken: notificationToken,
      fromUserProviderId,
      toUserProviderId,
    });
  }
}

export default SendRateNotificationService;
