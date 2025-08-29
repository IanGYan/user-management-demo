import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT用户负载接口
 */
interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Optional JWT authentication guard that allows both authenticated
 * and unauthenticated requests to proceed. Useful for routes that
 * provide different functionality based on authentication status.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Handles authentication without throwing errors for unauthenticated users
   * @param _err - Authentication error (unused)
   * @param user - User object (if authentication succeeded)
   * @param _info - Additional info (unused)
   * @param _context - Execution context (unused)
   * @param _status - Optional status (unused)
   * @returns User object if authenticated, undefined if not authenticated
   */
  handleRequest<TUser = JwtPayload>(
    _err: Error | null,
    user: JwtPayload | false,
    _info?: unknown,
    _context?: ExecutionContext,
    _status?: unknown,
  ): TUser {
    // Unlike the regular JwtAuthGuard, we don't throw an exception
    // if there's no user or if authentication fails
    // This allows the route to be accessed by both authenticated and unauthenticated users
    return (user || undefined) as TUser;
  }

  /**
   * Always allows the request to proceed, but sets user context if token is valid
   * @param context - Execution context containing request information
   * @returns Always returns true to allow the request
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to authenticate, but don't fail if it doesn't work
      await super.canActivate(context);
    } catch {
      // Ignore authentication errors - we want to allow unauthenticated access
    }

    // Always allow the request to proceed
    return true;
  }
}
