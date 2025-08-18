import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'patient.john@example.com',
    description: 'Account email to receive reset link',
    required: true
  })
  @IsEmail()
  email: string;
}