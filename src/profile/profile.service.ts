import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt'; // <-- add this

@Injectable()
export class ProfileService {
  clearResetPasswordToken: any;
  clearActivationToken: any;
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createProfileDto.password, salt);

    const profile = this.profileRepository.create({
      ...createProfileDto,
      password: hashedPassword,  // ✅ store hashed password
    });

    return this.profileRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  async findOne(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { email } });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile | null> {
    if (updateProfileDto.password) {
      const salt = await bcrypt.genSalt();
      updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, salt);
    }

    await this.profileRepository.update(id, updateProfileDto);
    return this.profileRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async setPassword(id: string, password: string): Promise<Profile> {
    const profile = await this.findOne(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.profileRepository.update(id, { password: hashedPassword, isActive: true });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Profile not found after update');
    }
    return updated;
  }

  async setResetPasswordToken(id: string, token: string): Promise<void> {
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    await this.profileRepository.update(id, { 
      resetPasswordToken: token, 
      resetPasswordExpires: expires 
    });
  }

  async findOneByResetToken(token: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ 
      where: { resetPasswordToken: token },
    });
  }

  async findOneByActivationToken(token: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ 
      where: { id: token, isActive: false },
    });
  }
}
