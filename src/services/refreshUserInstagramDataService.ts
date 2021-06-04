import { getMongoRepository, MongoRepository } from 'typeorm';
import User from '../models/User';

import { get_user_media } from '../apis/instagram';
import AppError from '../errors/appError';

interface IRequest {
  userProviderId: string;
  token: string;
}

interface UserMedia {
  id: string;
  caption: string;
  media_url: string;
}

interface IResponse {
  userMedia: UserMedia[];
}

class RefreshUserInstagramDataService {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async execute({
    userProviderId,
    token,
  }: IRequest): Promise<IResponse> {
    const foundUser = await this.ormRepository.findOne({
      where: { userProviderId },
    });

    if (!foundUser) throw new AppError('user not found', 401);

    const userMedia = await get_user_media(token);

    return { userMedia };
  }
}

export default RefreshUserInstagramDataService;
