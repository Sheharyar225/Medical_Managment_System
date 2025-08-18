import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../profile/entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN)
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @Get('profile/:profileId')
  @Roles(Role.ADMIN)
  findByProfileId(@Param('profileId') profileId: string) {
    return this.adminService.findByProfileId(profileId);
  }
}