import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Designation {
  @PrimaryGeneratedColumn()
  designation_id: number;

  @Column({ type: 'varchar', length: 255 })
  designation_name: string;
   
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => Faculty, faculty => faculty.designation)
  faculties: Faculty[];
}
