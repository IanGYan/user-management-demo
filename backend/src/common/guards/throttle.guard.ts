import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * 认证用户接口
 */
interface AuthenticatedUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

/**
 * 带有用户信息的请求接口
 */
interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

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
  protected generateKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // If user is authenticated, use user ID for rate limiting
    if (request.user && request.user.id) {
      return `user-${request.user.id}`;
    }

    // For unauthenticated requests, use IP address
    const ip =
      request.ip ||
      (request.connection as { remoteAddress?: string })?.remoteAddress ||
      'unknown';
    return `ip-${ip}`;
  }

  /**
   * Custom error message for rate limit exceeded
   * @returns Error message
   */
  protected getErrorMessage(): Promise<string> {
    return Promise.resolve('请求过于频繁，请稍后重试');
  }
}
