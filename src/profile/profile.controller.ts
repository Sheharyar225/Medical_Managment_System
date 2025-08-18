import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    console.log('Fetching all profiles');
    return this.profileService.findAll();
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}