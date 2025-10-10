import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => PostEntity, (post: PostEntity) => post.categories)
  posts: PostEntity[];
}
