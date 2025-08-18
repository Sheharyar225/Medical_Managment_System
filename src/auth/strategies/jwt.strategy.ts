import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // reject expired tokens
       secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', 
    });

    console.log('🚀 JWT_SECRET loaded:', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    // This becomes `req.user`
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}