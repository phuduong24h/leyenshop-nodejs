require('dotenv').config();

const ENV = {
  database: process.env.POSTGRES_NAME,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: 'postgres'
};

module.exports = {
  development: ENV,
  staging: ENV,
  production: ENV
};
