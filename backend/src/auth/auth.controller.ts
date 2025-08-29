import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '../common/decorators/throttle.decorator';

/**
 * Controller responsible for authentication endpoints
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Health check endpoint for auth module
   */
  @Get('test')
  @Public()
  @ApiOperation({ summary: '认证模块健康检查' })
  @ApiResponse({ status: 200, description: '返回测试消息' })
  getTestMessage(): string {
    return this.authService.getTestMessage();
  }

  /**
   * 用户注册端点
   */
  @Post('register')
  @Public()
  @Throttle(5, 60) // 每分钟最多5次请求
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: '注册成功，请检查邮箱并点击验证链接',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            email: { type: 'string', example: 'user@example.com' },
            isVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '请求参数错误' },
        error: { type: 'string', example: '密码不符合安全要求' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '邮箱已存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '该邮箱已被注册' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<{
    success: boolean;
    message: string;
    data: UserResponseDto;
  }> {
    const user = await this.authService.register(registerDto);

    // TODO: 发送验证邮件
    // await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      success: true,
      message: '注册成功，请检查邮箱并点击验证链接',
      data: user,
    };
  }

  /**
   * 用户登录端点
   */
  @Post('login')
  @Public()
  @Throttle(10, 60) // 每分钟最多10次请求
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '登录成功' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid' },
                email: { type: 'string', example: 'user@example.com' },
                isVerified: { type: 'boolean', example: true },
                createdAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                },
              },
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', example: 'jwt_access_token' },
                refreshToken: { type: 'string', example: 'jwt_refresh_token' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '认证失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '邮箱或密码错误' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '账户被锁定或未验证',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '账户被锁定或请先验证邮箱' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<{
    success: boolean;
    message: string;
    data: LoginResponse;
  }> {
    const loginResponse = await this.authService.login(loginDto);

    return {
      success: true,
      message: '登录成功',
      data: loginResponse,
    };
  }

  /**
   * 刷新令牌端点
   */
  @Post('refresh')
  @Public()
  @Throttle(20, 60) // 每分钟最多20次请求
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({
    status: 200,
    description: '令牌刷新成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '令牌刷新成功' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'new_jwt_access_token' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '刷新令牌无效',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '无效的刷新令牌' },
      },
    },
  })
  async refreshToken(
    @Body() refreshTokenDto: { refreshToken: string },
  ): Promise<{
    success: boolean;
    message: string;
    data: { accessToken: string };
  }> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );

    return {
      success: true,
      message: '令牌刷新成功',
      data: result,
    };
  }

  /**
   * 用户登出端点
   */
  @Post('logout')
  @Public()
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({
    status: 200,
    description: '登出成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '登出成功' },
      },
    },
  })
  async logout(@Body() logoutDto: { refreshToken?: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    if (logoutDto.refreshToken) {
      await this.authService.logout(logoutDto.refreshToken);
    }

    return {
      success: true,
      message: '登出成功',
    };
  }
}
