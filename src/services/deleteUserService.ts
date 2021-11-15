import AppError from '../errors/appError';
import User, { IUser } from '../models/User';
import Evaluation from '../models/Evaluation';

import { LocalStorageProvider } from '../providers/localStorageProvider';
import { S3StorageProvider } from '../providers/s3StorageProvider';

interface IRequest {
  userProviderId: string;
}

class DeleteUserService {
  StorageProvider = {
    LOCAL: LocalStorageProvider,
    PRODUCTION: S3StorageProvider,
  };

  private provider: LocalStorageProvider | S3StorageProvider;

  constructor() {
    this.provider =
      process.env.ENVIRONMENT === 'LOCAL'
        ? new this.StorageProvider.LOCAL()
        : new this.StorageProvider.PRODUCTION();
  }

  public async execute({ userProviderId }: IRequest): Promise<IUser> {
    const foundUser = await User.findOneAndDelete({ userProviderId }).exec();

    if (!foundUser) throw new AppError('User does not exist');

    await Evaluation.deleteMany().where('fromUserId').equals(foundUser).exec();

    await Evaluation.deleteMany().where('toUserId').equals(foundUser).exec();

    if (foundUser.avatar) {
      await this.provider.delete({ avatarFileName: foundUser.avatar });
    }

    return foundUser;
  }
}

export default DeleteUserService;
