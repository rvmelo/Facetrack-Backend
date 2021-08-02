import AppError from '../errors/appError';
import {
  get_token,
  get_username,
  get_user_media,
  get_long_lived_access_token,
} from '../apis/instagram';

interface IRequest {
  authCode: string;
}

interface UserMedia {
  id: string;
  caption: string;
  media_url: string;
}

interface IResponse {
  userName: string;
  userMedia: UserMedia[];
  token: string;
}

class GetUserInstagramDataService {
  private token: string | undefined;

  private longLivedAccessToken: string | undefined;

  constructor() {
    this.token = undefined;
    this.longLivedAccessToken = undefined;
  }

  public async execute({ authCode }: IRequest): Promise<IResponse> {
    if (!authCode) {
      throw new AppError('No authorization code', 401);
    }

    this.token = await get_token(authCode);
    this.longLivedAccessToken = await get_long_lived_access_token(this.token);

    const userName = await get_username(this.longLivedAccessToken);
    const userMedia = await get_user_media(this.longLivedAccessToken);

    return { userName, userMedia, token: this.longLivedAccessToken };
  }
}

export default GetUserInstagramDataService;
