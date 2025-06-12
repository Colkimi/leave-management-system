import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { Department } from 'src/department/entities/department.entity';
import { Designation } from 'src/designation/entities/designation.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { History } from 'src/leave-history/entities/leave-history.entity';

@Entity()
export class LoadAdjustment {
  @PrimaryGeneratedColumn()
  adjustment_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  adjustment_date: Date;

  @Column({ type: 'varchar', length: 50 })
  adjustment_type: string;

  @Column()
  adjustment_hours: number;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @ManyToOne(() => Application, (application) => application.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'leave_id' })
  application: Application;

  @ManyToOne(() => Department, (department) => department.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Designation, (designation) => designation.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @ManyToOne(
    () => Administrator,
    (administrator) => administrator.loadAdjustments,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'admin_id' })
  administrator: Administrator;

  @ManyToOne(() => Allotment, (allotment) => allotment.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'allotment_id' })
  allotment: Allotment;

  @ManyToOne(() => History, (history) => history.loadAdjustments, {
    nullable: true,
  })
  @JoinColumn({ name: 'history_id' })
  history: History;
}
