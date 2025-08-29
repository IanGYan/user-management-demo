import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * 登录请求体接口
 */
interface LoginRequestBody {
  email?: string;
  [key: string]: unknown;
}

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
  protected generateKey(context: ExecutionContext): string {
    const request = context
      .switchToHttp()
      .getRequest<Request & { body: LoginRequestBody }>();
    const ip =
      request.ip ||
      (request.connection as { remoteAddress?: string })?.remoteAddress ||
      'unknown';

    // For auth endpoints, also consider the email if provided
    const body = request.body as LoginRequestBody;
    const email = body?.email || 'no-email';

    return `auth-${ip}-${email}`;
  }

  /**
   * Custom error message for authentication rate limiting
   * @param _context - Execution context (unused)
   * @param _throttlerLimitDetail - Throttler limit details (unused)
   * @returns Specific error message for auth attempts
   */
  protected getErrorMessage(
    _context: ExecutionContext,
    _throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<string> {
    return Promise.resolve('登录尝试过于频繁，请15分钟后再试');
  }
}
