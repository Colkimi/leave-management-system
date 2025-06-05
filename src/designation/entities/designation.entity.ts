import { Faculty } from 'src/faculty/entities/faculty.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';

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

  @OneToMany(() => Faculty, (faculty) => faculty.designation)
  faculties: Faculty[];

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.designation)
  loadAdjustments: LoadAdjustment[];
}
