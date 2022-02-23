/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import cron from 'node-cron';
import { refresh_long_lived_token } from '../../apis/instagram';
import UserPermissions from '../../models/UserPermissions';

async function refreshInstagramTokens(): Promise<void> {
  const permissions = await UserPermissions.find().exec();

  for (let i = 0; i < permissions.length; i++) {
    try {
      const { instagramToken } = permissions[i] || {};

      const newToken = await refresh_long_lived_token(instagramToken);

      permissions[i].instagramToken = newToken;

      await permissions[i].save();
    } catch {
      // invalid instagram token
    }
  }
}

export const refreshInstagramTokensJob = cron.schedule(
  '0 0 1 * *',
  refreshInstagramTokens,
  {
    scheduled: false,
  },
);
