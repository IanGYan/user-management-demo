import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

/**
 * User entity according to requirements
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column({ name: 'verification_token', type: 'varchar', nullable: true })
  verificationToken!: string | null;

  @Column({
    name: 'verification_token_expires',
    type: 'timestamp',
    nullable: true,
  })
  verificationTokenExpires!: Date | null;

  @Column({ name: 'reset_password_token', type: 'varchar', nullable: true })
  resetPasswordToken!: string | null;

  @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null;

  @Column({ name: 'failed_login_attempts', default: 0 })
  failedLoginAttempts!: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  /**
   * 检查账户是否被锁定
   */
  get isLocked(): boolean {
    return Boolean(this.lockedUntil && this.lockedUntil > new Date());
  }

  /**
   * 检查验证令牌是否过期
   */
  get isVerificationTokenExpired(): boolean {
    return (
      !this.verificationTokenExpires ||
      this.verificationTokenExpires < new Date()
    );
  }

  /**
   * 检查重置密码令牌是否过期
   */
  get isResetPasswordTokenExpired(): boolean {
    return !this.resetPasswordExpires || this.resetPasswordExpires < new Date();
  }
}
