import * as express from 'express';
import envConfig from './config';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema';
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      myProperty: true,
    };
  },
});

server.listen(envConfig.SERVER_PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
