import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleCalendarService } from './google-calendar.service';

@ApiTags('Google Auth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleService: GoogleCalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Get Google OAuth URL' })
  @ApiResponse({ status: 200, description: 'Returns Google authentication URL' })
  async auth(): Promise<{ url: string }> {
    const authUrl = this.googleService.getAuthUrl();
    return { url: authUrl };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiResponse({ status: 500, description: 'Authentication failed' })
  async callback(@Query('code') code: string): Promise<{ message: string }> {
    try {
      await this.googleService.setCredentials(code);
      return { message: 'Google authentication successful! You can now create calendar events.' };
    } catch (error) {
      return { message: 'Authentication failed: ' + error.message };
    }
  }
}
