import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Appointment } from '../appointment/entities/appointment.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendActivationEmail(email: string, name: string, activationLink: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Activate your account',
      html: `
        <p>Hello ${name},</p>
        <p>Please click the following link to activate your account and set your password:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(email: string, name: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Please click the following link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendAppointmentCreatedEmail(email: string, name: string, appointment: Appointment): Promise<void> {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'New Appointment Scheduled',
      html: `
        <p>Hello ${name},</p>
        <p>A new appointment has been scheduled:</p>
        <p><strong>Date & Time:</strong> ${appointment.appointmentDateTime.toLocaleString()}</p>
        <p><strong>Location:</strong> ${appointment.location}</p>
        <p><strong>Description:</strong> ${appointment.description}</p>
        <p>You will receive a calendar invite shortly.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}