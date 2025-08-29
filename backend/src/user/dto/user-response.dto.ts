import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user response (excluding sensitive data)
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: true,
  })
  isVerified!: boolean;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last account update date',
    example: '2024-01-16T14:20:00Z',
  })
  updatedAt!: string;
}
