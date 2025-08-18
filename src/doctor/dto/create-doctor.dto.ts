import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

export class CreateDoctorDto {
  @IsNotEmpty()
  profile: CreateProfileDto;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  clinicName: string;
}

