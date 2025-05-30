import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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
    nullable: true,
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @ManyToOne(() => Allotment, { nullable: true })
  @JoinColumn({ name: 'allotment_id' })
  allotment: Allotment;
}
