import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCheckUpDto {
  @ApiProperty({ example: 'uuid-of-patient-profile' })
  @IsNotEmpty()
  patientProfileId: string;

  @ApiProperty({ example: 'uuid-of-doctor-profile' })
  @IsNotEmpty()
  doctorProfileId: string;

  @ApiProperty({ example: 'Routine Kidney Check-up' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Patient complains of mild pain in lower back' })
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty({ example: 'Kidney stone detected' })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({ example: 'Painkillers and hydration advised' })
  @IsString()
  @IsNotEmpty()
  prescription: string;

  @ApiProperty({ example: '2025-08-16T10:00:00Z', type: String })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  checkUpDate: Date;
}
