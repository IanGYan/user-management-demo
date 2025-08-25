import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller responsible for authentication endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Health check endpoint for auth module
   */
  @Get('test')
  getTestMessage(): string {
    return this.authService.getTestMessage();
  }
}
