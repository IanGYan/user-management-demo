import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/configuration';

/**
 * Database module for TypeORM configuration
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');

        // 如果有 DATABASE_URL，优先使用它
        if (dbConfig?.url) {
          return {
            type: 'postgres',
            url: dbConfig.url,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: dbConfig.synchronize || false,
            logging: dbConfig.logging || false,
            migrationsRun: dbConfig.migrationsRun || false,
            autoLoadEntities: true,
            ssl:
              process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
          };
        }

        // 否则使用单独的连接参数
        return {
          type: 'postgres',
          host: dbConfig?.host || 'localhost',
          port: dbConfig?.port || 5432,
          username: dbConfig?.username || 'postgres',
          password: dbConfig?.password || 'postgres',
          database: dbConfig?.database || 'user_management_dev',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: dbConfig?.synchronize || false,
          logging: dbConfig?.logging || false,
          migrationsRun: dbConfig?.migrationsRun || false,
          autoLoadEntities: true,
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
