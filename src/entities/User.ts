import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class Users {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;
}
