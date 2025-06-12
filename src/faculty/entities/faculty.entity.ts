import { Role } from 'src/profiles/entities/profile.entity'; 
import { Department } from 'src/department/entities/department.entity';
import { Designation } from 'src/designation/entities/designation.entity';
import { Hod } from 'src/hod/entities/hod.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { History } from 'src/leave-history/entities/leave-history.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';
import { User } from 'src/profiles/entities/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

@Entity()
export class Faculty {
  @PrimaryGeneratedColumn()
  faculty_id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken: string | null;

  @Column({ type: 'varchar', length: 255 })
  faculty_name: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_login: Date;

  @OneToOne(() => Hod, (hod) => hod.faculty)
  hod: Hod;

  @OneToOne(() => User, (user) => user.admin, {cascade: true})
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Department, (department) => department.faculties)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Designation, (designation) => designation.faculties)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @OneToMany(() => Application, (application) => application.faculty)
  leaveApplications: Application[];

  @OneToMany(() => Allotment, (Allotment) => Allotment.faculty)
  leaveAllotments: Allotment[];

  @OneToMany(() => History, (history) => history.faculty)
  leaveHistory: History[];

  @OneToMany(() => LoadAdjustment, (loadAdjustment) => loadAdjustment.faculty)
  loadAdjustments: LoadAdjustment[];

}
