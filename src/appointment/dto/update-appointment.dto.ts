import { IsDate, IsOptional, IsString, IsEnum } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";

export class UpdateAppointmentDto {
  @IsDate()
  @IsOptional()
  appointmentDateTime?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  description?: string;
}