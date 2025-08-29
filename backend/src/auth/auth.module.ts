import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../user/entities/user.entity';
import { CryptoService } from '../common/services/crypto.service';
import { CustomJwtService } from './services/jwt.service';
import { JwtAuthModule } from './jwt.module';

/**
 * Auth module handles user authentication and authorization
 */
@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User]), JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService, CustomJwtService],
  exports: [AuthService, CustomJwtService],
})
export class AuthModule {}
