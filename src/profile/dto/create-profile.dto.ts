import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '../entities/profile.entity';

export class CreateProfileDto {
  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

 @IsString()
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'Invalid phone number format'
  })
  phoneNumber: string;


  @IsString()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsOptional() // If you want it to be optional
  isActive?: boolean;
}

