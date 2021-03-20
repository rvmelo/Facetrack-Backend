import AppError from '../errors/appError';
import { get_token, get_username, get_user_media } from '../apis/instagram';

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
}

class GetUserInstagramDataService {
  private token: string | undefined;

  constructor() {
    this.token = undefined;
  }

  public async execute({ authCode }: IRequest): Promise<IResponse> {
    if (!authCode) {
      throw new AppError('No authorization code', 401);
    }

    this.token = await get_token(authCode);

    const userName = await get_username(this.token);
    const userMedia = await get_user_media(this.token);

    return { userName, userMedia };
  }
}

export default GetUserInstagramDataService;
