import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'doctor.smith@example.com',
    description: 'Registered email address',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Secure@Password123!',
    description: 'Account password (min 8 chars)',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}