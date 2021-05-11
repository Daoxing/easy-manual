import envConfig from '../config';

const DBconnection = require('knex')({
  client: 'pg',
  connection: {
    host: envConfig.PG_HOST,
    user: envConfig.PG_USER,
    password: envConfig.PG_PASSWORD,
    database: envConfig.PG_DATABASE,
  },
});
DBconnection.on('query', (query) => {
  console.log(`[${new Date()}]:`, query);
}).on('query-response', (response, query) => {});
export { DBconnection };
