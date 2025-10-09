import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
