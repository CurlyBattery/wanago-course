import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.posts, {})
  author: UserEntity;

  @ManyToMany(
    () => CategoryEntity,
    (category: CategoryEntity) => category.posts,
  )
  @JoinTable()
  categories: CategoryEntity[];
}
