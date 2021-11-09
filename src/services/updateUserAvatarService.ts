import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

import { LocalStorageProvider } from '../providers/localStorageProvider';
import { S3StorageProvider } from '../providers/s3StorageProvider';

interface Request {
  userProviderId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
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

  public async execute({
    userProviderId,
    avatarFileName,
  }: Request): Promise<IUser> {
    const user = await User.findOne({ userProviderId }).exec();

    if (!user) throw new AppError('can not change user avatar', 401);

    if (user.avatar) {
      await this.provider.delete({ avatarFileName: user.avatar });
    }

    const resizedFile = await this.provider.save({ avatarFileName });

    user.avatar = resizedFile;
    const savedUser = await user.save();

    return savedUser;
  }
}

export default UpdateUserAvatarService;
