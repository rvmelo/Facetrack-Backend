import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

interface UserMedia {
  id: string;
  caption: string;
  media_url: string;
}

interface InstagramData {
  userName: string;
  userMedia: UserMedia[];
}

@Entity('users')
class User {
  @ObjectIdColumn()
  @Exclude()
  id: ObjectID;

  @PrimaryColumn()
  userProviderId: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  birthDate: Date;

  @Column()
  sex: 'male' | 'female' | undefined;

  @Column()
  relationshipStatus: 'single' | 'serious relationship' | 'married' | undefined;

  @Column()
  sexualOrientation:
    | 'heterosexual'
    | 'homosexual'
    | 'bisexual'
    | 'asexual'
    | undefined;

  @Column()
  instagram: InstagramData;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
