import { Model } from 'objection';

import { knexPostgres, sequelizePostgres } from 'configs/database';

export const connectSequelizeToPostgreSQL = () => {
  try {
    sequelizePostgres.authenticate();
    console.log('%c[SUCCESS]: postgreSQL connection successful 🚀', 'color:green');
  } catch (error) {
    console.log('%c[ERROR]: postgreSQL connection fail: ' + error, 'color:red');
  }
};

export const connectKnexToPostgreSQL = async () => {
  try {
    await knexPostgres.raw('select 1+1 as result');
    Model.knex(knexPostgres);
    console.log('%c[SUCCESS]: postgreSQL connection successful 🚀', 'color:green');
  } catch (error) {
    console.log('%c[ERROR]: postgreSQL connection fail: ' + error, 'color:red');
  }
};
