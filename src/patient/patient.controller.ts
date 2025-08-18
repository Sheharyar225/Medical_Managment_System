import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../profile/entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN)
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

  @Get('profile/:profileId')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
  findByProfileId(@Param('profileId') profileId: string) {
    return this.patientService.findByProfileId(profileId);
  }
}