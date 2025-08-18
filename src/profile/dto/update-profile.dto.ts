import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
  password: any;
}