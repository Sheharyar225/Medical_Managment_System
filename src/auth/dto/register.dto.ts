import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Dr. Sarah Wilson',
    description: 'Full name of the doctor',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'sarah.wilson@cardio.com',
    description: 'Professional email address',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+14155551234',
    description: 'Phone number in E.164 format',
    required: true
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'Cardio@Secure123',
    description: 'Password (min 8 chars, 1 uppercase, 1 special char)',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Cardiology',
    description: 'Medical specialization',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({
    example: 'MD-CARDIO-456',
    description: 'Medical license number',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({
    example: 'Heart Care Specialists',
    description: 'Name of clinic/hospital',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  clinicName: string;
}