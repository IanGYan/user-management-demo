import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomThrottlerGuard } from './guards/throttle.guard';

/**
 * Throttle module that configures rate limiting for the application
 * Uses configuration from environment variables
 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttle.ttl') || 60,
          limit: configService.get<number>('throttle.limit') || 100,
        },
      ],
    }),
  ],
  providers: [CustomThrottlerGuard],
  exports: [ThrottlerModule, CustomThrottlerGuard],
})
export class ThrottleConfigModule {}
