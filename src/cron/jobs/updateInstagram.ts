/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import cron from 'node-cron';
import { get_user_media } from '../../apis/instagram';
import User from '../../models/User';
import UserPermissions from '../../models/UserPermissions';

export async function updateInstagram(): Promise<void> {
  const permissions = await UserPermissions.find().exec();

  for (let i = 0; i < permissions.length; i++) {
    try {
      const { instagramToken, userProviderId } = permissions[i] || {};

      const user = await User.findOne({
        userProviderId,
      }).exec();

      if (!instagramToken || !user) {
        continue;
      }

      const instagramMedia = await get_user_media(instagramToken);

      if (user?.instagram && user?.instagram?.userMedia) {
        Object.assign(user?.instagram?.userMedia, instagramMedia);
      }

      await user?.save();
    } catch (err) {
      // invalid instagram token
    }
  }
}

export const updateInstagramJob = cron.schedule('0 0 * * *', updateInstagram, {
  scheduled: false,
});
