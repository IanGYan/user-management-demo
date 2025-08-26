import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes as public (no authentication required)
 * Use this decorator on controllers or route handlers that should
 * be accessible without JWT authentication
 *
 * @example
 * ```typescript
 * @Public()
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
export const Public = () => SetMetadata('isPublic', true);
