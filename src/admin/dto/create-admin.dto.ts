import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

export class CreateAdminDto {
  @ApiProperty({ type: CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @ApiProperty({ example: 'IT Department' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'SuperAdmin' })
  @IsString()
  @IsNotEmpty()
  accessLevel: string;
}
