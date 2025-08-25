import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * Controller responsible for user management endpoints
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Health check endpoint for user module
   */
  @Get('test')
  getTestMessage(): string {
    return this.userService.getTestMessage();
  }
}
