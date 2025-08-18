import { IsString, IsOptional } from "class-validator";

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  accessLevel?: string;
}