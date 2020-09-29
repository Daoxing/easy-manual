require('dotenv').config(
  {path:__dirname + "/.env"}
);

const envConfig=Object.assign({},process.env);

  module.exports = {
    client: 'pg',
    connection: {
      host : envConfig.PG_HOST,
      user : envConfig.PG_USER,
      password : envConfig.PG_PASSWORD,
      database : envConfig.PG_DATABASE
    },
    migrations: {
        directory: './migrations',
        loadExtensions: ['.ts'],
        extension: 'ts'
      },
      seeds: {
        directory: './seeds',
        loadExtensions: ['.ts']
      }
  };