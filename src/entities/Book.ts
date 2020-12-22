import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export default class Books {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  publisher: string;

  @Column()
  state_book: string;

  @Column()
  date_edition: string;
}
