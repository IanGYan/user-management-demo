import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for password reset
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token',
    example: 'reset-token-uuid-string',
  })
  @IsString({ message: '重置令牌必须是字符串' })
  token!: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePass123!',
    minLength: 8,
  })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(8, { message: '新密码至少需要8个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?])/,
    {
      message:
        '新密码必须包含至少1个小写字母、1个大写字母、1个数字和1个特殊字符',
    },
  )
  newPassword!: string;
}
