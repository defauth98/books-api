import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export default class Publisher {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}
