import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Service for handling password hashing and verification
 * using bcrypt encryption algorithm
 */
@Injectable()
export class CryptoService {
  private readonly saltRounds = 12;

  /**
   * Hashes a plain text password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise that resolves to the hashed password
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(
        `密码加密失败: ${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * Verifies a plain text password against a hashed password
   * @param password - Plain text password to verify
   * @param hashedPassword - Hashed password to compare against
   * @returns Promise that resolves to true if passwords match, false otherwise
   */
  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error(
        `密码验证失败: ${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * Generates a random salt for password hashing
   * @param rounds - Number of salt rounds (default: 12)
   * @returns Promise that resolves to the generated salt
   */
  async generateSalt(rounds: number = this.saltRounds): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(rounds);
      return salt;
    } catch (error) {
      throw new Error(
        `生成salt失败: ${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * Hashes a password with a specific salt
   * @param password - Plain text password to hash
   * @param salt - Salt to use for hashing
   * @returns Promise that resolves to the hashed password
   */
  async hashPasswordWithSalt(password: string, salt: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(
        `使用自定义salt加密失败: ${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }
}
