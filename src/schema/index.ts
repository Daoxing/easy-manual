import { gql } from 'apollo-server';

import group from './group';
import user from './user';

let types = ``;
let queries = {};
let mutations = {};
let otherResolvers = {};
[group, user].forEach((e) => {
  const { typeDef, resolver } = e;
  types = types.concat(typeDef);
  const { Query = {}, Mutation = {}, ...others } = resolver as any;
  queries = Object.assign(queries, Query);
  mutations = Object.assign(mutations, Mutation);
  otherResolvers = Object.assign(otherResolvers, others);
});

const typeDefs = gql`
  ${types}
`;
const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...otherResolvers,
};
export { typeDefs, resolvers };
