import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
