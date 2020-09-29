import * as _ from 'lodash';
require('dotenv').config({ path: __dirname + '/.env' });

const envConfig = Object.assign({}, process.env);
const defaultEnv = {
  SERVER_PORT: 3000,
  GRAPHQL_URL: 'graphql',
};

Object.keys(defaultEnv).forEach((key) => {
  if (!_.has(envConfig, key)) {
    _.set(envConfig, key, _.get(defaultEnv, key));
  }
});
export default envConfig;
