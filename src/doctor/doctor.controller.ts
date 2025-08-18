import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../profile/entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('doctors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) 
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN)
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }

  @Get('profile/:profileId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findByProfileId(@Param('profileId') profileId: string) {
    return this.doctorService.findByProfileId(profileId);
  }
}