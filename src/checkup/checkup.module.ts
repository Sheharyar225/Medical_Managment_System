import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckUpService } from './checkup.service';
import { CheckUpController } from './checkup.controller';
import { CheckUp } from './entities/checkup.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([CheckUp]), ProfileModule],
  controllers: [CheckUpController],
  providers: [CheckUpService],
  exports: [CheckUpService],
})
export class CheckUpModule {}