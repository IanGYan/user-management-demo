import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// 加载环境变量
config();

/**
 * TypeORM configuration for migrations
 */
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

export default AppDataSource;
