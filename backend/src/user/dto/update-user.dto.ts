import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating user information
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New email address',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Current password for verification',
    example: 'CurrentPass123!',
  })
  @IsOptional()
  @IsString({ message: '当前密码必须是字符串' })
  @MinLength(1, { message: '当前密码不能为空' })
  currentPassword?: string;

  @ApiPropertyOptional({
    description: 'New password',
    example: 'NewSecurePass123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(8, { message: '新密码至少需要8个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])/,
    {
      message:
        '新密码必须包含至少1个小写字母、1个大写字母、1个数字和1个特殊字符',
    },
  )
  newPassword?: string;
}
