import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT authentication guard that allows both authenticated
 * and unauthenticated requests to proceed. Useful for routes that
 * provide different functionality based on authentication status.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Handles authentication without throwing errors for unauthenticated users
   * @param err - Authentication error
   * @param user - User object (if authentication succeeded)
   * @returns User object if authenticated, undefined if not authenticated
   */
  handleRequest(_err: any, user: any): any {
    // Unlike the regular JwtAuthGuard, we don't throw an exception
    // if there's no user or if authentication fails
    // This allows the route to be accessed by both authenticated and unauthenticated users
    return user;
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
    } catch (error) {
      // Ignore authentication errors - we want to allow unauthenticated access
    }

    // Always allow the request to proceed
    return true;
  }
}
