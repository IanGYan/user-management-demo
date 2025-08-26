import { Injectable } from '@nestjs/common';

/**
 * Service responsible for user management business logic
 */
@Injectable()
export class UserService {
  /**
   * Returns test message for health check
   */
  getTestMessage(): string {
    return 'User module is working!';
  }
}
