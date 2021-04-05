import { gql } from 'apollo-server';

import group from './group';
import user from './user';
import article from './article';

let types = `
scalar Date
`;
let queries = {
  root: () => {
    return 'root query success!';
  },
};
let mutations = {
  root: () => {
    return 'root mutation success!';
  },
};
let otherResolvers = {};
[group, user, article].forEach((e) => {
  const { typeDef, resolver } = e;
  types = types.concat(typeDef);
  const { Query = {}, Mutation = {}, ...others } = resolver as any;
  queries = Object.assign(queries, Query);
  mutations = Object.assign(mutations, Mutation);
  otherResolvers = Object.assign(otherResolvers, others);
});

const typeDefs = gql`
  type Query {
    root: String!
  }

  type Mutation {
    root: String!
  }
  ${types}
`;
const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...otherResolvers,
};
export { typeDefs, resolvers };
