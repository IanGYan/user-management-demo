import { Injectable } from '@nestjs/common';

/**
 * Service responsible for authentication business logic
 */
@Injectable()
export class AuthService {
  /**
   * Returns test message for health check
   */
  getTestMessage(): string {
    return 'Auth module is working!';
  }
}
