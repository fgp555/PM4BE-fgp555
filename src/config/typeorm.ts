// src/config/typeorm.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

console.info('process.env.DB_NAME', process.env.DB_NAME);

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: true, // Enable schema synchronization
  dropSchema: true, // Drop schema on every application start
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
};

// export default config as DataSourceOptions
export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
