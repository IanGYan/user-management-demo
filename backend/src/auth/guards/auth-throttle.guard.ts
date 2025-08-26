import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Specialized throttle guard for authentication endpoints
 * Implements stricter rate limiting for login attempts
 */
@Injectable()
export class AuthThrottleGuard extends ThrottlerGuard {
  /**
   * Generates a key for auth-specific rate limiting
   * Uses a combination of IP address and email for more precise control
   * @param context - Execution context containing request information
   * @returns Unique identifier for auth rate limiting
   */
  protected generateKey(context: any): string {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress || 'unknown';

    // For auth endpoints, also consider the email if provided
    const email = request.body?.email || 'no-email';

    return `auth-${ip}-${email}`;
  }

  /**
   * Custom error message for authentication rate limiting
   * @returns Specific error message for auth attempts
   */
  protected async getErrorMessage(): Promise<string> {
    return '登录尝试过于频繁，请15分钟后再试';
  }
}
