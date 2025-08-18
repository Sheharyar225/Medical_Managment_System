import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ProfileService } from '../profile/profile.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { AppointmentStatus } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly profileService: ProfileService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      // Verify profiles exist
      const patientProfile = await this.profileService.findOne(createAppointmentDto.patientProfileId);
      const doctorProfile = await this.profileService.findOne(createAppointmentDto.doctorProfileId);

      if (!patientProfile || !doctorProfile) {
        throw new NotFoundException('Patient or Doctor profile not found');
      }

     // Convert incoming string to Date object
const appointmentDate = new Date(createAppointmentDto.appointmentDateTime);

// Create Google Calendar Event
const googleEvent = await this.googleCalendarService.createEvent({
  summary: 'Medical Appointment',
  location: createAppointmentDto.location,
  description: createAppointmentDto.description,
  start: {
    dateTime: appointmentDate.toISOString(),
    timeZone: 'UTC',
  },
  end: {
    dateTime: new Date(appointmentDate.getTime() + 30 * 60000).toISOString(),
    timeZone: 'UTC',
  },
  attendees: [
    { email: patientProfile.email },
    { email: doctorProfile.email },
  ],
});


      // Create and save appointment
      const appointment = this.appointmentRepository.create({
        appointmentDateTime: createAppointmentDto.appointmentDateTime,
        location: createAppointmentDto.location,
        description: createAppointmentDto.description,
        status: createAppointmentDto.status || AppointmentStatus.SCHEDULED,
        googleCalendarEventId: googleEvent.id || null,
        patientProfile: patientProfile,
        doctorProfile: doctorProfile,
      });

      return await this.appointmentRepository.save(appointment as Appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async findOne(id: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async findByPatientId(patientProfileId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patientProfile: { id: patientProfileId } },
      relations: ['patientProfile', 'doctorProfile'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async findByDoctorId(doctorProfileId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { doctorProfile: { id: doctorProfileId } },
      relations: ['patientProfile', 'doctorProfile'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Update Google Calendar event if relevant fields changed
    if (appointment.googleCalendarEventId && (
      updateAppointmentDto.appointmentDateTime ||
      updateAppointmentDto.location ||
      updateAppointmentDto.description
    )) {
      await this.googleCalendarService.updateEvent(
        appointment.googleCalendarEventId,
        {
          summary: 'Medical Appointment',
          location: updateAppointmentDto.location || appointment.location,
          description: updateAppointmentDto.description || appointment.description,
          start: {
            dateTime: (
              updateAppointmentDto.appointmentDateTime ||
              appointment.appointmentDateTime
            ).toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: new Date(
              (
                updateAppointmentDto.appointmentDateTime ||
                appointment.appointmentDateTime
              ).getTime() + 30 * 60000,
            ).toISOString(),
            timeZone: 'UTC',
          },
        },
      );
    }

    // Update database record
    await this.appointmentRepository.update(id, {
      ...updateAppointmentDto,
      status: updateAppointmentDto.status || appointment.status,
    });

    return this.appointmentRepository.findOneOrFail({
      where: { id },
      relations: ['patientProfile', 'doctorProfile'],
    });
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Delete from Google Calendar if exists
    if (appointment.googleCalendarEventId) {
      await this.googleCalendarService.deleteEvent(appointment.googleCalendarEventId);
    }

    await this.appointmentRepository.delete(id);
  }
}