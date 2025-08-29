import { SetMetadata } from '@nestjs/common';

/**
 * Custom throttle configuration interface
 */
export interface ThrottleConfig {
  ttl: number; // Time to live in seconds
  limit: number; // Number of requests allowed within TTL
}

/**
 * Decorator to set custom throttle limits for specific routes
 * Overrides the global throttle configuration
 *
 * @param ttl - Time window in seconds
 * @param limit - Maximum number of requests allowed in the time window
 *
 * @example
 * ```typescript
 * @Throttle(60, 5) // 5 requests per minute
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
export const Throttle = (
  ttl: number,
  limit: number,
): ReturnType<typeof SetMetadata> => SetMetadata('throttle', { ttl, limit });

/**
 * Decorator to skip throttling for specific routes
 * Useful for routes that should not be rate limited
 *
 * @example
 * ```typescript
 * @SkipThrottle()
 * @Get('health')
 * async healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const SkipThrottle = (): ReturnType<typeof SetMetadata> =>
  SetMetadata('skipThrottle', true);
