import { get_user_media } from '../apis/instagram';
import AppError from '../errors/appError';

import FindUserService from './findUserService';

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
  public async execute({
    userProviderId,
    token,
  }: IRequest): Promise<IResponse> {
    const findUserService = new FindUserService();

    const foundUser = await findUserService.execute({ userProviderId });

    if (!foundUser) throw new AppError('user not found', 401);

    const userMedia = await get_user_media(token);

    return { userMedia };
  }
}

export default RefreshUserInstagramDataService;
