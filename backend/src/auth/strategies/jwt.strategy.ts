import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../services/jwt.service';

/**
 * JWT authentication strategy using Passport
 * Validates JWT tokens and retrieves user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.secret') || 'default-secret-key',
    });
  }

  /**
   * Validates the JWT payload and returns the user
   * This method is called automatically by Passport when a JWT is found
   * @param payload - Decoded JWT payload
   * @returns User object if valid, throws UnauthorizedException if invalid
   */
  async validate(payload: JwtPayload): Promise<any> {
    try {
      // Extract user ID from payload
      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException('令牌中缺少用户ID');
      }

      // Retrieve user from database
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // Check if user account is active/verified
      if (!user.isVerified) {
        throw new UnauthorizedException('账户未验证，请检查邮箱');
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new UnauthorizedException('账户已被锁定，请稍后重试');
      }

      // Return user object (excluding sensitive information)
      return {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('令牌验证失败');
    }
  }
}
