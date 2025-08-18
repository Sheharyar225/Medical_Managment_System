import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'uuid-of-patient-profile' })
  @IsNotEmpty()
  patientProfileId: string;

  @ApiProperty({ example: 'uuid-of-doctor-profile' })
  @IsNotEmpty()
  doctorProfileId: string;

 @ApiProperty({ example: '2025-08-20T14:30:00Z', type: String })
  @IsDateString()
  @IsNotEmpty()
  appointmentDateTime: string;

  @ApiProperty({ example: 'Room 305, City Hospital' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Follow-up for kidney stone treatment' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.PENDING, required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
