// // src/session/entities/session.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
// import { Profile } from '../../profile/entities/profile.entity';

// @Entity('sessions')
// export class Session {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Profile, (profile) => profile.sessions, { onDelete: 'CASCADE', eager: true })
//   profile: Profile;

//   @Index({ unique: true })
//   @Column({ type: 'text' })
//   accessToken: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @Column({ type: 'timestamptz' })
//   expiresAt: Date;

//   @Column({ default: true })
//   isActive: boolean;
// }
