import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CheckUpService } from './checkup.service';
import { CreateCheckUpDto } from './dto/create-checkup.dto';
import { UpdateCheckUpDto } from './dto/update-checkup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../profile/entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('checkups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CheckUpController {
  constructor(private readonly checkUpService: CheckUpService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Body() createCheckUpDto: CreateCheckUpDto) {
    return this.checkUpService.create(createCheckUpDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN)
  findAll() {
    return this.checkUpService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.PATIENT)
  findOne(@Param('id') id: string) {
    return this.checkUpService.findOne(id);
  }

  @Get('patient/:patientProfileId')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.PATIENT)
  findByPatientId(@Param('patientProfileId') patientProfileId: string) {
    return this.checkUpService.findByPatientId(patientProfileId);
  }

  @Get('doctor/:doctorProfileId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findByDoctorId(@Param('doctorProfileId') doctorProfileId: string) {
    return this.checkUpService.findByDoctorId(doctorProfileId);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateCheckUpDto: UpdateCheckUpDto) {
    return this.checkUpService.update(id, updateCheckUpDto);
  }

  @Delete(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.checkUpService.remove(id);
  }
}