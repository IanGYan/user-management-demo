import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 */
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(8, { message: '密码至少需要8个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/,
    {
      message: '密码必须包含至少1个小写字母、1个大写字母、1个数字和1个特殊字符',
    },
  )
  password!: string;
}
