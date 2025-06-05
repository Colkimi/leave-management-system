import { Faculty } from 'src/faculty/entities/faculty.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column({ type: 'varchar', length: 255 })
  department_name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => Faculty, (faculty) => faculty.department)
  faculties: Faculty[];

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.department)
  loadAdjustments: LoadAdjustment[];
}
