import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleCalendarService {
  private readonly oauth2Client: OAuth2Client;
  private refreshToken: string | null = null;

  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: '9',
      redirectUri: 'http://localhost:3000/auth/google/callback'
    });
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async setCredentials(code: string): Promise<void> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      
      if (tokens.refresh_token) {
        this.refreshToken = tokens.refresh_token;
      }
    } catch (error) {
      console.error('Error setting credentials:', error);
      throw new InternalServerErrorException('Failed to authenticate with Google');
    }
  }

  async createEvent(event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event> {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
      });
      return response.data;
    } catch (error) {
      if (error.code === 401 && this.refreshToken) {
        try {
          const { credentials } = await this.oauth2Client.refreshAccessToken();
          this.oauth2Client.setCredentials(credentials);
          return this.createEvent(event);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          throw new InternalServerErrorException('Failed to refresh Google token');
        }
      }
      console.error('Error creating event:', error);
      throw new InternalServerErrorException('Failed to create Google Calendar event');
    }
  }

  async updateEvent(eventId: string, event: calendar_v3.Schema$Event) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    try {
      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: event
      });
      return response.data;
    } catch (error) {
      if (error.code === 401 && this.refreshToken) {
        try {
          const { credentials } = await this.oauth2Client.refreshAccessToken();
          this.oauth2Client.setCredentials(credentials);
          return this.updateEvent(eventId, event);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          throw new InternalServerErrorException('Failed to refresh Google token');
        }
      }
      console.error('Error updating event:', error);
      throw new InternalServerErrorException('Failed to update Google Calendar event');
    }
  }

  async deleteEvent(eventId: string) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId
      });
    } catch (error) {
      if (error.code === 401 && this.refreshToken) {
        try {
          const { credentials } = await this.oauth2Client.refreshAccessToken();
          this.oauth2Client.setCredentials(credentials);
          return this.deleteEvent(eventId);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          throw new InternalServerErrorException('Failed to refresh Google token');
        }
      }
      console.error('Error deleting event:', error);
      throw new InternalServerErrorException('Failed to delete Google Calendar event');
    }
  }
}
