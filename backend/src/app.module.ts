import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ThrottleConfigModule } from './common/throttle.module';
import { JwtAuthModule } from './auth/jwt.module';
import { CryptoService } from './common/services/crypto.service';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ThrottleConfigModule,
    JwtAuthModule,
    AuthModule,
    UserModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
