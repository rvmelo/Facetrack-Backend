import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

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
  id: ObjectID;

  @PrimaryColumn()
  userProviderId: string;

  @Column()
  name: string;

  @Column()
  birthDate: string;

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
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
