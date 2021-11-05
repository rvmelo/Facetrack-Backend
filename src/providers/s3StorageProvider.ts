import { S3 } from 'aws-sdk';

import mime from 'mime';

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

interface InputData {
  avatarFileName: string;
}

class S3StorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save({ avatarFileName }: InputData): Promise<string> {
    const avatarPath = path.join(uploadConfig.directory, avatarFileName);

    const resizedFile = `resized-${avatarFileName}`;

    const newAvatarPath = path.join(
      __dirname,
      '..',
      '..',
      `tmp/${resizedFile}`,
    );

    await sharp(avatarPath)
      .resize({ width: 640, height: 640 })
      .toFile(newAvatarPath);

    await fs.promises.unlink(avatarPath);

    const fileContent = await fs.promises.readFile(newAvatarPath);
    const ContentType = mime.getType(newAvatarPath);
    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/avatar`,
        Key: resizedFile,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: ContentType || '',
      })
      .promise();

    await fs.promises.unlink(newAvatarPath);

    return resizedFile;
  }

  async delete({ avatarFileName }: InputData): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/avatar`,
        Key: avatarFileName,
      })
      .promise();
  }
}

export { S3StorageProvider };
