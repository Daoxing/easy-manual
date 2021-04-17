import express = require('express');
import { ApolloServer } from 'apollo-server-express';

import envConfig from './config';
import { typeDefs, resolvers } from './schema';
import { requestUser } from './middleware/requestUser';
import { router } from './router';

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      requestUser,
    },
  });
  server.setGraphQLPath(envConfig.GRAPHQL_URL);
  server.applyMiddleware({ app });
  app.use(router);
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
