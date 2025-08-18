// // src/session/session.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThanOrEqual } from 'typeorm';
// import { Session } from './entities/session.entity';
// import { Profile } from '../profile/entities/profile.entity';

// @Injectable()
// export class SessionService {
//   constructor(
//     @InjectRepository(Session)
//     private readonly sessionRepo: Repository<Session>,
//   ) {}

//   async create(profile: Profile, accessToken: string, expiresInSeconds: number): Promise<Session> {
//     const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
//     const session = this.sessionRepo.create({ profile, accessToken, expiresAt, isActive: true });
//     return this.sessionRepo.save(session);
//   }

//   async findByToken(token: string): Promise<Session | null> {
//     return this.sessionRepo.findOne({
//       where: { accessToken: token, isActive: true },
//     });
//   }

//   async deactivateByToken(token: string): Promise<void> {
//     const session = await this.findByToken(token);
//     if (session) {
//       session.isActive = false;
//       await this.sessionRepo.save(session);
//     }
//   }

//   async deactivate(sessionId: string): Promise<void> {
//     await this.sessionRepo.update(sessionId, { isActive: false });
//   }

//   async clearUserSessions(profileId: string): Promise<void> {
//     await this.sessionRepo.update({ profile: { id: profileId } as any }, { isActive: false });
//   }

//   async purgeExpired(): Promise<void> {
//     const now = new Date();
//     await this.sessionRepo.update({ expiresAt: LessThanOrEqual(now) }, { isActive: false });
//   }
// }
