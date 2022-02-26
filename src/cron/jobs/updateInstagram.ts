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
      console.log('iteration: ', i);

      const { instagramToken, userProviderId } = permissions[i] || {};

      console.log('step 1');

      const user = await User.findOne({
        userProviderId,
      }).exec();

      console.log('step 2');

      if (!instagramToken || !user) {
        continue;
      }

      console.log('step 3');

      const instagramMedia = await get_user_media(instagramToken);

      console.log('step 4');

      if (user?.instagram && user?.instagram?.userMedia) {
        Object.assign(user?.instagram?.userMedia, instagramMedia);
      }

      console.log('step 5');

      await user?.save();

      console.log('step 6');
    } catch (err) {
      // invalid instagram token
      console.log('Failed to update instagram: ', err);
    }
  }
}

export const updateInstagramJob = cron.schedule('0 0 * * *', updateInstagram, {
  scheduled: false,
});
