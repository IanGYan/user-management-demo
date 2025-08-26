import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../user/entities/user.entity';

/**
 * Auth module handles user authentication and authorization
 */
@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
