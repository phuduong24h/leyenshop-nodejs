require('dotenv').config();
const fs = require('fs');
const path = require('path');

const migrationsBasePath = path.join(__dirname, 'knex/migrations');

const migrationDirs = fs
  .readdirSync(migrationsBasePath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join(migrationsBasePath, dirent.name));

const ENV = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_NAME,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USERNAME
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationDirs
  },
  seeds: {
    directory: 'knex/seeds'
  }
};

module.exports = {
  development: ENV,
  staging: ENV,
  production: ENV
};
