import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Email module handles email sending operations
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
