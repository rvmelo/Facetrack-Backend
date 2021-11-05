import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

interface InputData {
  avatarFileName: string;
}

class LocalStorageProvider {
  async save({ avatarFileName }: InputData): Promise<string> {
    const avatarPath = path.join(uploadConfig.directory, avatarFileName);

    const resizedFile = `resized-${avatarFileName}`;

    await sharp(avatarPath)
      .resize({ width: 640, height: 640 })
      .toFile(path.join(__dirname, '..', '..', `tmp/${resizedFile}`));

    await fs.promises.unlink(avatarPath);

    return resizedFile;
  }

  async delete({ avatarFileName }: InputData): Promise<void> {
    const userAvatarFilePath = path.join(
      uploadConfig.directory,
      avatarFileName,
    );

    const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

    if (userAvatarFileExists) {
      await fs.promises.unlink(userAvatarFilePath);
    }
  }
}

export { LocalStorageProvider };
