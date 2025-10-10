import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { AddressEntity } from './address.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => AddressEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: AddressEntity;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  posts: PostEntity[];
}
