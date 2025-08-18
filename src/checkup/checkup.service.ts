import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckUp } from './entities/checkup.entity';
import { CreateCheckUpDto } from './dto/create-checkup.dto';
import { UpdateCheckUpDto } from './dto/update-checkup.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class CheckUpService {
  constructor(
    @InjectRepository(CheckUp)
    private checkUpRepository: Repository<CheckUp>,
    private profileService: ProfileService,
  ) {}

  async create(createCheckUpDto: CreateCheckUpDto): Promise<CheckUp> {
    const patientProfile = await this.profileService.findOne(createCheckUpDto.patientProfileId);
    const doctorProfile = await this.profileService.findOne(createCheckUpDto.doctorProfileId);

    if (!patientProfile || !doctorProfile) {
      throw new Error('Patient or Doctor profile not found');
    }

    const checkUp = this.checkUpRepository.create({
      ...createCheckUpDto,
      patientProfile,
      doctorProfile,
    });

    return this.checkUpRepository.save(checkUp);
  }

  async findAll(): Promise<CheckUp[]> {
    return this.checkUpRepository.find({ 
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async findOne(id: string): Promise<CheckUp | null> {
    return this.checkUpRepository.findOne({ 
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async findByPatientId(patientProfileId: string): Promise<CheckUp[]> {
    return this.checkUpRepository.find({ 
      where: { patientProfile: { id: patientProfileId } },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async findByDoctorId(doctorProfileId: string): Promise<CheckUp[]> {
    return this.checkUpRepository.find({ 
      where: { doctorProfile: { id: doctorProfileId } },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async update(id: string, updateCheckUpDto: UpdateCheckUpDto): Promise<CheckUp | null> {
    await this.checkUpRepository.update(id, updateCheckUpDto);
    return this.checkUpRepository.findOne({ 
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.checkUpRepository.delete(id);
  }
}