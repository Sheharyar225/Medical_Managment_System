import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile/profile.service';
import { DoctorService } from '../doctor/doctor.service';
import { MailService } from '../mail/mail.service';
import { Role } from '../profile/entities/profile.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly doctorService: DoctorService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  
  private async validateUser(email: string, pass: string) {
    const profile = await this.profileService.findByEmail(email);
    if (!profile || !profile.isActive || !profile.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, profile.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: profile.id, email: profile.email, role: profile.role };
  }

 /**  Login */
async login(loginDto: LoginDto) {
  const profile = await this.profileService.findByEmail(loginDto.email);
  if (!profile || !profile.isActive || !profile.password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(loginDto.password, profile.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 🔑 JWT payload (must match JwtStrategy expectations)
  const payload = { sub: profile.id, email: profile.email, role: profile.role };

  // 🔑 Generate JWT
  const token = this.jwtService.sign(payload, {
    secret: this.configService.get<string>('JWT_SECRET')!,
    expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '1h',
  });

  return {
    accessToken: token,
    user: {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.fullName,
    },
  };
}


  /**  Register (Doctor example) */
  async register(registerDto: RegisterDto) {
    const existingProfile = await this.profileService.findByEmail(
      registerDto.email,
    );
    if (existingProfile) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Create profile
    const profile = await this.profileService.create({
      role: Role.DOCTOR, // default doctor role
      fullName: registerDto.fullName,
      email: registerDto.email,
      phoneNumber: registerDto.phoneNumber,
      password: hashedPassword,
      isActive: false, // requires activation
    });

    // Create linked doctor record
    await this.doctorService.create({
      profile,
      specialization: registerDto.specialization,
      licenseNumber: registerDto.licenseNumber,
      clinicName: registerDto.clinicName,
    });

    // Send activation email
    const activationToken = uuidv4();
    await this.profileService.clearActivationToken(profile.id, activationToken);

    const activationUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/activate-account?token=${activationToken}`;

    await this.mailService.sendActivationEmail(
      profile.email,
      profile.fullName,
      activationUrl,
    );

    return {
      message: 'Registration successful, please check your email to activate account',
    };
  }

  /**  Forgot Password */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const profile = await this.profileService.findByEmail(
      forgotPasswordDto.email,
    );

    if (!profile) {
      return {
        message:
          'If an account with that email exists, a reset link has been sent',
      };
    }

    const token = uuidv4();
    await this.profileService.setResetPasswordToken(profile.id, token);

    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(
      profile.email,
      profile.fullName,
      resetUrl,
    );

    return {
      message:
        'If an account with that email exists, a reset link has been sent',
    };
  }

  /**  Reset Password */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const profile = await this.profileService.findOneByResetToken(
      resetPasswordDto.token,
    );

    if (
      !profile ||
      !profile.resetPasswordToken ||
      !profile.resetPasswordExpires
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (new Date() > profile.resetPasswordExpires) {
      throw new UnauthorizedException('Token has expired');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      salt,
    );

    await this.profileService.setPassword(profile.id, hashedPassword);
    await this.profileService.clearResetPasswordToken(profile.id);

    return { message: 'Password reset successfully' };
  }

  /**  Activate Account */
  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const profile = await this.profileService.findOneByActivationToken(
      activateAccountDto.token,
    );
    if (!profile) {
      throw new UnauthorizedException('Invalid activation token');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      activateAccountDto.password,
      salt,
    );

    await this.profileService.setPassword(profile.id, hashedPassword);
    // await this.profileService.activateProfile(profile.id);

    return { message: 'Account activated successfully' };
  }

  /** 🔹 Logout (handled client-side in JWT, just return msg) */
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
