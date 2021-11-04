const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("../../middleware/auth");
const {
  queryGetUser,
  mutateLogin,
  mutateSignup,
  mutateVerifyEmail,
  mutateResendCode,
  mutateForgotPassword,
  mutateResetPassword,
  mutateEditProfile,
} = require("./users.model");

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
    verifyEmail: async (_, args) => {
      return await mutateVerifyEmail(args.input);
    },
    resendAuthCode: async (_, args) => {
      return await mutateResendCode(args.input.token);
    },
    forgotPassword: async (_, args) => {
      return await mutateForgotPassword(args.input.email);
    },
    resetPassword: async (_, args) => {
      return await mutateResetPassword(args.input);
    },
    editProfile: combineResolvers(isAuthenticated, async (_, args, context) => {
      return await mutateEditProfile(args.input, context.user._id);
    }),
  },
};
