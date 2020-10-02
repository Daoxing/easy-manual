import * as express from 'express';
import envConfig from './config';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema';
import { requestUser } from './middleware/requestUser';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    requestUser,
  },
});

server.listen(envConfig.SERVER_PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
