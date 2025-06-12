import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Relation,
} from 'typeorm';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Hod } from 'src/hod/entities/hod.entity';

export enum Role {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  HOD = 'hod',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Administrator, (admin) => admin.user)
  admin: Relation<Administrator>;

  @OneToOne(() => Faculty, (faculty) => faculty.user)
  faculty: Relation<Faculty>;

  @OneToOne(() => Hod, (hod) => hod.user)
  hod: Relation<Hod>;
}
