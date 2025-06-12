import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { Faculty } from '../../faculty/entities/faculty.entity';
import { Department } from '../../department/entities/department.entity';
import { User } from 'src/profiles/entities/profile.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';

@Entity()
export class Hod {
  @PrimaryGeneratedColumn()
  hod_id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_login: Date;

  @OneToOne(() => User, (user) => user.hod, {cascade: true})
  @JoinColumn()
  user: Relation<User>;

  @OneToOne(() => Faculty, (faculty) => faculty.hod)
  @JoinColumn()
  faculty: Faculty;

  @OneToOne(() => Department)
  @JoinColumn()
  department: Department;

  @OneToMany(
      () => Application,
      (application) => application.approvedByHod,
    )
    approvedApplications: Application[];

}
