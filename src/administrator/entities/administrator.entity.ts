import { Role } from 'src/profiles/entities/profile.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Relation
} from 'typeorm';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';
import { User } from 'src/profiles/entities/profile.entity';

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn()
  admin_id: number;

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

  @OneToOne(() => User, (user) => user.admin, {cascade: true})
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(() => Application, (application) => application.approvedByAdmin)
  approvedApplications: Application[];

  @OneToMany(
    () => LoadAdjustment,
    (loadAdjustment) => loadAdjustment.administrator,
  )
  loadAdjustments: LoadAdjustment[];
}
