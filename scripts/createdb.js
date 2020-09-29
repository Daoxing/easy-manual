require('dotenv').config(
    {path:__dirname + "/../.env"}
);

const envConfig=Object.assign({},process.env);

var knex = require('knex')({
    client: 'pg',
    connection: {
      host : envConfig.PG_HOST,
      user : envConfig.PG_USER,
      password : envConfig.PG_PASSWORD,
      database : envConfig.PG_DATABASE
    }
});

knex.raw(`CREATE DATABASE "${envConfig.PG_DATABASE}"`).then(function(){
console.log(`Database ${envConfig.PG_DATABASE} on ${envConfig.PG_HOST} created`)
}).catch((error)=>console.error(error.message)).finally(()=>process.exit());