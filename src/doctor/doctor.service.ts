import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ProfileService } from '../profile/profile.service';
import { Role } from '../profile/entities/profile.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private profileService: ProfileService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const profile = await this.profileService.create({
      ...createDoctorDto.profile,
      role: Role.DOCTOR,
    });

    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      profile,
    });

    return this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({ relations: ['profile'] });
  }

  async findOne(id: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async findByProfileId(profileId: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ 
      where: { profile: { id: profileId } },
      relations: ['profile'],
    });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor | null> {
    await this.doctorRepository.update(id, updateDoctorDto);
    return this.doctorRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
    
    if (doctor && doctor.profile) {
      await this.doctorRepository.delete(id);
      await this.profileService.remove(doctor.profile.id);
    }
  }
}