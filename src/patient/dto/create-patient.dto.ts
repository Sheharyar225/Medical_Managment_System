import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

export class CreatePatientDto {
  @ApiProperty({ type: CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @ApiProperty({ example: 30 })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'Male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: '123 Main Street, Karachi' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'Diabetes, Hypertension' })
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'Brother: +923009876543' })
  @IsString()
  @IsOptional()
  emergencyContact?: string;
}
