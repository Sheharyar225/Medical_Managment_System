import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../profile/entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  // @Roles(Role.DOCTOR)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN)
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.PATIENT)
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Get('patient/:patientProfileId')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.PATIENT)
  findByPatientId(@Param('patientProfileId') patientProfileId: string) {
    return this.appointmentService.findByPatientId(patientProfileId);
  }

  @Get('doctor/:doctorProfileId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findByDoctorId(@Param('doctorProfileId') doctorProfileId: string) {
    return this.appointmentService.findByDoctorId(doctorProfileId);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}