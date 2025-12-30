import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];
}
