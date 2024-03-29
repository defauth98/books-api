import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Publisher from './Publisher';

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

  @ManyToOne(() => Publisher, publisher => publisher.id)
  publisher: Publisher;

  @Column()
  state_book: string;

  @Column()
  date_edition: string;

  @Column()
  image_path: string;
}
