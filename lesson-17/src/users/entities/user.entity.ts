import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  posts: PostEntity[];

  @CreateDateColumn()
  created_at: Date;
}
