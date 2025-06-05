import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';

@Entity()
export class Allotment {
  @PrimaryGeneratedColumn()
  allotment_id: number;

  @Column({ type: 'varchar', length: 255 })
  leave_type: string;

  @Column()
  total_days: number;

  @Column()
  remaining_days: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.leaveAllotments, {
    nullable: true,
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @OneToOne(() => Application, (application) => application.allotment)
  application: Application;

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.allotment)
  loadAdjustments: LoadAdjustment[];
}
