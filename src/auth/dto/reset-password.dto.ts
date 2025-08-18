import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890',
    description: 'Token from password reset email',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'NewSecure@Password456',
    description: 'New password (min 8 chars)',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}