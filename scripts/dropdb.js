require('dotenv').config(
    {path:__dirname + "./../.env"}
);
const envConfig=Object.assign({},process.env);
const allowEnvs=["development","test"];
if (!allowEnvs.includes(envConfig.NODE_ENV)) {
console.log(`Be carefull when you are in ${envConfig.NODE_ENV}`);
return;
}

var knex = require('knex')({
    client: 'pg',
    connection: {
      host : envConfig.PG_HOST,
      user : envConfig.PG_USER,
      password : envConfig.PG_PASSWORD,
      database : envConfig.PG_DATABASE,
      charset : 'utf8'
    }
});

knex.raw(`DROP DATABASE "${envConfig.PG_DATABASE}";`)
.then(function(){console.log(`Database ${envConfig.PG_DATABASE} on ${envConfig.PG_HOST} droped`)})
.catch((error)=>console.error(error.message)).finally(()=>process.exit());