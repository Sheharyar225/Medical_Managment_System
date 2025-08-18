import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({
    example: 'x1y2z3a4-b5c6-7890',
    description: 'Activation token from registration email',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'Activation@Pass123',
    description: 'Initial password for the account',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}