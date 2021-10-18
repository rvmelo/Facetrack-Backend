import User, { IUser } from '../models/User';
import AppError from '../errors/appError';

interface Request {
  userProviderId: string;
  coords: {
    longitude: string;
    latitude: string;
  };
}

class UpdateUserLocationService {
  public async execute({
    coords,
    userProviderId,
  }: Request): Promise<IUser | null> {
    const user = await User.findOne({
      userProviderId,
    }).exec();

    if (!user) throw new AppError('user does not exist', 401);

    const { longitude, latitude } = coords;

    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);

    if (Object.is(NaN, parsedLongitude) || Object.is(NaN, parsedLatitude)) {
      throw new AppError('Invalid data');
    }

    Object.assign(user, {
      ...user,
      location: {
        type: 'Point',
        coordinates: [parsedLongitude, parsedLatitude],
      },
    });

    const savedUser = await user.save();

    return savedUser;
  }
}

export default UpdateUserLocationService;
