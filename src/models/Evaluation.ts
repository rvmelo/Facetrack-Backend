import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('evaluation')
class Evaluation {
  @ObjectIdColumn()
  @Exclude()
  id: ObjectID;

  @Column()
  value: number;

  @Column()
  fromUserId: string;

  @Column()
  toUserId: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default Evaluation;
