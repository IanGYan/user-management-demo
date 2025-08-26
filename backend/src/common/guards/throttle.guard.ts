import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom throttle guard that extends the default ThrottlerGuard
 * to provide rate limiting for API endpoints
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Generates a unique key for rate limiting based on user context
   * @param context - Execution context containing request information
   * @returns Unique identifier for rate limiting
   */
  protected generateKey(context: any): string {
    const request = context.switchToHttp().getRequest();

    // If user is authenticated, use user ID for rate limiting
    if (request.user && request.user.id) {
      return `user-${request.user.id}`;
    }

    // For unauthenticated requests, use IP address
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    return `ip-${ip}`;
  }

  /**
   * Custom error message for rate limit exceeded
   * @param context - Execution context
   * @returns Error message
   */
  protected async getErrorMessage(): Promise<string> {
    return '请求过于频繁，请稍后重试';
  }
}
