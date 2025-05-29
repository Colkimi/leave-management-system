import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Faculty } from 'src/faculty/entities/faculty.entity';

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

  @ManyToOne(() => Faculty, faculty => faculty.leaveAllotments, { nullable: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

}
