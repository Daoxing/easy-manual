import * as _ from 'lodash';
require('dotenv').config({ path: __dirname + '/../../.env' });

const envConfig: any = Object.assign({}, process.env);
const defaultEnv = {
  SERVER_PORT: 3000,
  GRAPHQL_URL: '/graphql',
  ALLOW_PHONE_LOCALE: ['zh-CN'],
};

Object.keys(defaultEnv).forEach((key) => {
  if (!_.has(envConfig, key)) {
    let defaultValue = _.get(defaultEnv, key);
    if (Array.isArray(_.get(defaultEnv, key))) {
      defaultValue = defaultValue.split(',');
    }
    _.set(envConfig, key, defaultValue);
  }
});
export default envConfig;
