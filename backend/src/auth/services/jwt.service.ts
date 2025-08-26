import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT payload interface
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

/**
 * Token pair interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Custom JWT service that handles token generation,
 * verification, and refresh token management
 */
@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates an access token for a user
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns Signed JWT access token
   */
  generateAccessToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  /**
   * Generates a refresh token for a user
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns Signed JWT refresh token
   */
  generateRefreshToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }

  /**
   * Generates both access and refresh tokens
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns Object containing both tokens
   */
  generateTokenPair(userId: string, email: string): TokenPair {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email),
    };
  }

  /**
   * Verifies an access token and returns the payload
   * @param token - JWT access token to verify
   * @returns Decoded JWT payload
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch (error) {
      throw new Error('无效的访问令牌');
    }
  }

  /**
   * Verifies a refresh token and returns the payload
   * @param token - JWT refresh token to verify
   * @returns Decoded JWT payload
   */
  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch (error) {
      throw new Error('无效的刷新令牌');
    }
  }

  /**
   * Decodes a JWT token without verification (for debugging)
   * @param token - JWT token to decode
   * @returns Decoded token payload
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  /**
   * Extracts the bearer token from authorization header
   * @param authorizationHeader - Authorization header value
   * @returns Extracted token or null
   */
  extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
