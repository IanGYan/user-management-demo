import { Injectable } from '@nestjs/common';

/**
 * Service responsible for email sending operations
 */
@Injectable()
export class EmailService {
  /**
   * Sends verification email to user
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email sending logic
    console.log(`Sending verification email to ${email} with token ${token}`);
  }

  /**
   * Sends password reset email to user
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // TODO: Implement password reset email logic
    console.log(`Sending password reset email to ${email} with token ${token}`);
  }
}
