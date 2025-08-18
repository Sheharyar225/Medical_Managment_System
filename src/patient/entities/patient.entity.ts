import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}