import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user login
 */
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(1, { message: '密码不能为空' })
  password!: string;
}
