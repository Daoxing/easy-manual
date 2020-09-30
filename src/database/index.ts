import envConfig from '../config';
import * as knex from 'knex';

export const DBconnection = knex({
  client: 'pg',
  connection: {
    host: envConfig.PG_HOST,
    user: envConfig.PG_USER,
    password: envConfig.PG_PASSWORD,
    database: envConfig.PG_DATABASE,
  },
});
