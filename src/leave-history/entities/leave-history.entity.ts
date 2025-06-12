import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  history_id: number;

  @Column({ type: 'varchar', length: 50 })
  leave_type: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  end_date: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Faculty, (faculty) => faculty.leaveHistory, {
    nullable: false,
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @ManyToOne(() => Application, (application) => application.leaveHistory, {
    nullable: false,
  })
  @JoinColumn({ name: 'leave_id' })
  application: Application;

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.history)
  loadAdjustments: LoadAdjustment[];
}
