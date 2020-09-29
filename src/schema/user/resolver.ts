export default {
  Mutation: {
    signUp: (parent, args, context, info) => {
      user_id: 'aaaaa';
    },
  },
  Query: {
    oneUser: () => {
      return { user_id: 'bbbbb' };
    },
  },
};
