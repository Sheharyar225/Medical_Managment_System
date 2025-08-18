import { IsString, IsOptional, IsDate } from "class-validator";

export class UpdateCheckUpDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  prescription?: string;

  @IsDate()
  @IsOptional()
  checkUpDate?: Date;
}