import express = require('express');
import { ApolloServer } from 'apollo-server-express';

import envConfig from './config';
import { typeDefs, resolvers, context } from './schema';
import { requestingUser } from './middleware';
import { router } from './router';
import _ from 'lodash';
import * as bodyParser from 'body-parser';
async function startApolloServer() {
  const app = express();
  app.use(bodyParser.json());
  // Graphql Middleware
  app.post(envConfig.GRAPHQL_URL, requestingUser);
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
    );
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  });
  app.use(router);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  server.applyMiddleware({ app });
  server.setGraphQLPath(envConfig.GRAPHQL_URL);
  return { server, app };
}

(async () => {
  const { app, server } = await startApolloServer();
  app.listen({ port: envConfig.SERVER_PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${envConfig.SERVER_PORT}${server.graphqlPath}`,
    );
  });
})();
