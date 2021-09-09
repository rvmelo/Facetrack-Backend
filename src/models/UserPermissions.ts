import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('user-permissions')
class UserPermissions {
  @ObjectIdColumn()
  @Exclude()
  id: ObjectID;

  @Column()
  userProviderId: string;

  @Column()
  notificationToken: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default UserPermissions;
