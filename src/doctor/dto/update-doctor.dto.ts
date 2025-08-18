import { IsOptional, IsString } from "class-validator";

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  clinicName?: string;
}