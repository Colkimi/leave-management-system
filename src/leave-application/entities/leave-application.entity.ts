import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { History } from 'src/leave-history/entities/leave-history.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  leave_id: number;

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

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  reason: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Faculty, (faculty) => faculty.leaveApplications, {
    nullable: false,
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @OneToOne(() => Allotment, { nullable: false })
  @JoinColumn({ name: 'allotment_id' })
  allotment: Allotment;

  @ManyToOne(() => Administrator, (administrator) => administrator.approvedApplications, {
    nullable: false,
  })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: Administrator;

  @OneToMany(() => History, (history) => history.application)
  leaveHistory: History[];

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.application)
  loadAdjustments: LoadAdjustment[];
}
