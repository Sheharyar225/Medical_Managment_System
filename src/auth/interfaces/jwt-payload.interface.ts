import { Role } from '../../profile/entities/profile.entity';

export interface JwtPayload {
  sub: any;
  id: string;
  email: string;
  role: Role;
}