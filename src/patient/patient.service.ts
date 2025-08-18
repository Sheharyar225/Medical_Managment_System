import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ProfileService } from '../profile/profile.service';
import { Role } from '../profile/entities/profile.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private profileService: ProfileService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const profile = await this.profileService.create({
      ...createPatientDto.profile,
      role: Role.PATIENT,
    });

    const patient = this.patientRepository.create({
      ...createPatientDto,
      profile,
    });

    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({ relations: ['profile'] });
  }

  async findOne(id: string): Promise<Patient | null> {
    return this.patientRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async findByProfileId(profileId: string): Promise<Patient | null> {
    return this.patientRepository.findOne({ 
      where: { profile: { id: profileId } },
      relations: ['profile'],
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient | null> {
    await this.patientRepository.update(id, updatePatientDto);
    return this.patientRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
  }

  async remove(id: string): Promise<void> {
    const patient = await this.patientRepository.findOne({ 
      where: { id },
      relations: ['profile'],
    });
    
    if (patient && patient.profile) {
      await this.patientRepository.delete(id);
      await this.profileService.remove(patient.profile.id);
    }
  }
}