import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export type media_types = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

interface UserMedia {
  id: string;
  caption: string;
  media_url: string;
  media_type: media_types;
  timestamp: string;
}

export interface IUser {
  userProviderId: string;
  name: string;
  avatar: string;
  rate: number;
  birthDate: string | undefined;
  sex: 'male' | 'female' | undefined;
  relationshipStatus: 'single' | 'serious relationship' | 'married' | undefined;
  sexualOrientation:
    | 'heterosexual'
    | 'homosexual'
    | 'bisexual'
    | 'asexual'
    | undefined;
  instagram:
    | {
        userName: string;
        userMedia: UserMedia[];
      }
    | undefined;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema({
  userProviderId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  relationshipStatus: {
    type: String,
    default: undefined,
    enum: ['single', 'serious relationship', 'married'],
    required: true,
  },
  sexualOrientation: {
    type: String,
    default: undefined,
    enum: ['heterosexual', 'homosexual', 'bisexual', 'asexual'],
    required: true,
  },
  instagram: {
    userName: {
      type: String,
      required: true,
    },
    userMedia: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          caption: {
            type: String,
            required: false,
          },
          media_url: {
            type: String,
            required: true,
          },
          media_type: {
            type: String,
            enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
            required: true,
          },
          timestamp: {
            type: String,
            required: false,
          },
        },
      ],
    },
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updated_at: {
    type: Date,
    required: false,
  },
});

export default model<IUser>('User', userSchema);
