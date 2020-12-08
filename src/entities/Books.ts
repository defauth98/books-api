import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export default class Books {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
