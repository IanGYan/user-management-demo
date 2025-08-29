import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { CryptoService } from '../common/services/crypto.service';
import { CustomJwtService, TokenPair } from './services/jwt.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { randomUUID } from 'crypto';

/**
 * Login response interface
 */
export interface LoginResponse {
  user: UserResponseDto;
  tokens: TokenPair;
}

/**
 * Service responsible for authentication business logic
 */
@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: CustomJwtService,
  ) {}

  /**
   * Returns test message for health check
   */
  getTestMessage(): string {
    return 'Auth module is working!';
  }

  /**
   * 注册新用户
   * @param registerDto 注册数据
   * @returns 创建的用户信息（不包含敏感数据）
   */
  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { email, password } = registerDto;

    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    try {
      // 加密密码
      const passwordHash = await this.cryptoService.hashPassword(password);

      // 生成验证令牌
      const verificationToken = randomUUID();
      const verificationTokenExpires = new Date();
      verificationTokenExpires.setHours(
        verificationTokenExpires.getHours() + 24,
      ); // 24小时有效期

      // 创建用户
      const user = this.userRepository.create({
        email,
        passwordHash,
        verificationToken,
        verificationTokenExpires,
        isVerified: false,
        failedLoginAttempts: 0,
      });

      const savedUser = await this.userRepository.save(user);

      // 返回用户信息（不包含敏感数据）
      return {
        id: savedUser.id,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
        createdAt: savedUser.createdAt.toISOString(),
        updatedAt: savedUser.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        `注册失败: ${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * 用户登录
   * @param loginDto 登录数据
   * @returns 登录响应（用户信息 + 令牌）
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // 查找用户
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 检查账户是否被锁定
    if (user.isLocked) {
      const remainingTime = Math.ceil(
        (user.lockedUntil!.getTime() - Date.now()) / 1000 / 60,
      );
      throw new ForbiddenException(
        `账户被锁定，请在 ${remainingTime} 分钟后重试`,
      );
    }

    // 检查邮箱是否已验证
    if (!user.isVerified) {
      throw new ForbiddenException('请先验证您的邮箱地址');
    }

    // 验证密码
    const isPasswordValid = await this.cryptoService.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      // 增加失败次数
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 登录成功，重置失败次数
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await this.userRepository.save(user);
    }

    // 生成令牌
    const tokens = this.jwtService.generateTokenPair(user.id, user.email);

    // 保存刷新令牌
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // 返回登录响应
    return {
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens,
    };
  }

  /**
   * 处理登录失败
   * @param user 用户实体
   */
  private async handleFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts += 1;

    // 如果达到最大尝试次数，锁定账户
    if (user.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
    }

    await this.userRepository.save(user);
  }

  /**
   * 保存刷新令牌
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    // 计算过期时间（7天）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 创建刷新令牌记录
    const refreshTokenEntity = this.refreshTokenRepository.create({
      user: { id: userId } as User,
      token: refreshToken,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱地址
   * @returns 用户实体或null
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * 刷新令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // 验证刷新令牌
      this.jwtService.verifyRefreshToken(refreshToken);

      // 检查令牌是否存在于数据库中
      const tokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
        relations: ['user'],
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('刷新令牌无效或已过期');
      }

      // 检查用户是否存在
      const user = tokenRecord.user;
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 生成新的访问令牌
      const accessToken = this.jwtService.generateAccessToken(
        user.id,
        user.email,
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }

  /**
   * 用户登出（单设备）
   * @param refreshToken 刷新令牌
   */
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      return; // 如果没有令牌，直接返回
    }

    // 删除刷新令牌
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  /**
   * 用户全设备登出
   * @param userId 用户ID
   */
  async logoutAllDevices(userId: string): Promise<void> {
    // 删除用户所有刷新令牌
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  /**
   * 清理过期的刷新令牌
   */
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now })
      .execute();
  }

  /**
   * 验证访问令牌并返回用户信息
   * @param token 访问令牌
   * @returns 用户信息
   */
  async validateAccessToken(token: string): Promise<UserResponseDto> {
    try {
      const payload = this.jwtService.verifyAccessToken(token);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      return {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch {
      throw new UnauthorizedException('无效的访问令牌');
    }
  }
}
