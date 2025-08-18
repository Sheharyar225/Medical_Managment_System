import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProfileService } from '../profile/profile.service';
import { Role } from '../profile/entities/profile.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private profileService: ProfileService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const profile = await this.profileService.create({
      ...createAdminDto.profile,
      role: Role.ADMIN,
    });

    const admin = this.adminRepository.create({
      ...createAdminDto,
      profile,
    });

    return this.adminRepository.save(admin);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({ relations: ['profile'] });
  }

  async findOne(id: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async findByProfileId(profileId: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ 
      where: { profile: { id: profileId } },
      relations: ['profile'],
    });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin | null> {
    await this.adminRepository.update(id, updateAdminDto);
    return this.adminRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async remove(id: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
    
    if (admin && admin.profile) {
      await this.adminRepository.delete(id);
      await this.profileService.remove(admin.profile.id);
    }
  }
}