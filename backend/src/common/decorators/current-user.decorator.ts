import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to extract the current authenticated user from the request
 * This decorator should be used in controllers that are protected by JWT authentication
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: any) {
 *   return this.userService.getProfile(user.id);
 * }
 * ```
 *
 * @param data - Optional property name to extract from user object
 * @param ctx - Execution context containing request information
 * @returns User object or specific user property if data parameter is provided
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // If a specific property is requested, return that property
    if (data) {
      return user[data];
    }

    // Otherwise, return the entire user object
    return user;
  },
);
