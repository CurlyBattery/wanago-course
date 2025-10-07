import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;
}
