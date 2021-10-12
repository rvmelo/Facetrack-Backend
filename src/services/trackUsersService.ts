import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

interface Request {
  distance: string;
  userProviderId: string;
}

class TrackUsersService {
  public async execute({
    distance,
    userProviderId,
  }: Request): Promise<IUser[] | null> {
    const user = await User.findOne({
      userProviderId,
    }).exec();

    if (!user) throw new AppError('user does not exist', 401);

    if (Object.is(NaN, parseInt(distance, 10))) {
      throw new AppError('Invalid data');
    }

    if (user.location?.coordinates.length !== 2) {
      throw new AppError('Invalid data');
    }

    const longitude = user.location?.coordinates[0];
    const latitude = user.location?.coordinates[1];

    if (!longitude || !latitude) {
      throw new AppError('No user location found');
    }

    const users = await User.find({
      location: {
        $near: {
          $maxDistance: distance,
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
      userProviderId: { $ne: userProviderId },
    }).exec();

    return users;
  }
}

export default TrackUsersService;
