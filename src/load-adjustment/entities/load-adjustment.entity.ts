import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

}
