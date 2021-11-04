const { skip } = require("graphql-resolvers");

function isAuthenticated(_, __, { user }) {
  if (!user) {
    throw new Error("You are not authenticated");
  }
  return skip;
}

function isAdmin(_, __, { user }) {
  if (!user.isAdmin) {
    throw new Error("You are not authorized");
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
};
