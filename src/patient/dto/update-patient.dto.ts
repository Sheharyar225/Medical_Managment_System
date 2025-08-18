import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePatientDto {
  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;
}