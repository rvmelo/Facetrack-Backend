import mongoose from 'mongoose';

const { Schema, model } = mongoose;

interface IUserPermission {
  userProviderId: string;
  notificationToken: string;
  created_at: Date;
  updated_at: Date;
}

const userPermissionSchema = new Schema({
  userProviderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  notificationToken: {
    type: String,
    required: true,
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

export default model<IUserPermission>('UserPermission', userPermissionSchema);
