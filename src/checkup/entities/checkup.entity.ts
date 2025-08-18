import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class CheckUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile)
  @JoinColumn()
  patientProfile: Profile;

  @ManyToOne(() => Profile)
  @JoinColumn()
  doctorProfile: Profile;

  @Column()
  title: string;

  @Column({ type: 'text' })
  notes: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  prescription: string;

  @Column()
  checkUpDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}