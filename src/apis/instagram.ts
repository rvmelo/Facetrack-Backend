import axios from 'axios';
import querystring from 'querystring';

interface UserMedia {
  id: string;
  caption: string;
  media_url: string;
}

export const get_token = async (authCode: string): Promise<string> => {
  const instagramAppData = querystring.stringify({
    client_id: process.env.INSTAGRAM_CLIENT_ID || '',
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.BASE_URL}/sessions/auth/instagram/callback`,
    code: authCode,
  });

  try {
    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      instagramAppData,
    );

    return response.data.access_token;
  } catch (err) {
    throw new Error(err);
  }
};

export const get_username = async (userToken: string): Promise<string> => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me?fields=id,username&access_token=${userToken}`,
    );

    return response.data.username;
  } catch (err) {
    throw new Error(err);
  }
};

export const get_user_media = async (
  userToken: string,
): Promise<UserMedia[]> => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp&access_token=${userToken}`,
    );

    return [...response.data.data];
  } catch (err) {
    throw new Error(err);
  }
};
