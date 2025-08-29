import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * JWT错误信息接口
 */
interface JwtError {
  name?: string;
  message?: string;
}

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
 * JWT authentication guard that protects routes requiring authentication
 * Can be used as a global guard or applied to specific controllers/routes
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Determines if the current request should be allowed to proceed
   * @param context - Execution context containing request information
   * @returns Promise or Observable resolving to boolean
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Call parent AuthGuard to perform JWT validation
    return super.canActivate(context);
  }

  /**
   * Handles authentication errors and provides user-friendly messages
   * @param err - Authentication error
   * @param user - User object (if authentication succeeded)
   * @param info - Additional information about the authentication attempt
   * @param context - Execution context
   * @param status - Optional status
   * @returns User object if authentication succeeded
   */
  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: JwtPayload | false,
    info: JwtError | undefined,
    _context?: ExecutionContext,
    _status?: unknown,
  ): TUser {
    // If there's an error or no user, throw an appropriate exception
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('访问令牌已过期，请重新登录');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('无效的访问令牌');
      }
      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('访问令牌尚未生效');
      }
      if (err) {
        throw err;
      }
      throw new UnauthorizedException('身份验证失败，请登录后重试');
    }

    return user as TUser;
  }
}
