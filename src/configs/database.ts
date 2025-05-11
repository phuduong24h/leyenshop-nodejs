// import redis from 'redis';
import dotenv from 'dotenv';
import Knex from 'knex';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelizePostgres = new Sequelize({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_NAME,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  dialect: 'postgres',
  logging: false
});

export const knexPostgres = Knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_NAME,
    timezone: 'UTC'
  },
  pool: {
    min: 2,
    max: 50
  }
});

// export const redisDB = redis.createClient({
//   url: process.env.REDIS_URL
// });
