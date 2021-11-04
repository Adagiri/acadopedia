const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("../../middleware/auth");
const { mutateLogin, mutateSignup } = require("./users.model");

module.exports = {
  Query: {
    getUser: combineResolvers(isAuthenticated, async (_, __, context) => {
      return await queryGetUser(context.user._id);
    }),
  },
  Mutation: {
    login: async (_, args) => {
      return await mutateLogin(args.input);
    },
    signup: async (_, args) => {
      return await mutateSignup(args.input);
    },
  },
};
