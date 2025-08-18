// // src/session/session.controller.ts
// import { Controller, Delete, Param, UseGuards, Req, Post } from '@nestjs/common';
// import { SessionService } from './session.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('sessions')
// export class SessionController {
//   constructor(private readonly sessionService: SessionService) {}

//   // Logout by session id (admin or self if you expose it)
//   @UseGuards(JwtAuthGuard)
//   @Delete(':id')
//   async logoutById(@Param('id') sessionId: string) {
//     await this.sessionService.deactivate(sessionId);
//     return { message: 'Logged out successfully' };
//   }

//   // Logout current token (recommended)
//   @UseGuards(JwtAuthGuard)
//   @Post('logout')
//   async logoutCurrent(@Req() req: any) {
//     // Expect "Authorization: Bearer <token>"
//     const authHeader: string | undefined = req.headers['authorization'] || req.headers['Authorization'];
//     const token = (authHeader || '').split(' ')[1] || '';
//     if (token) {
//       await this.sessionService.deactivateByToken(token);
//     }
//     return { message: 'Logged out successfully' };
//   }
// }
