const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const { mongoConnect } = require("./services/mongo");

const app = require("./app");
const { getUserInfo } = require("./services/context");
const typesArray = loadFilesSync(path.join(__dirname, "**/*.graphql"));
const resolversArray = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const PORT = process.env.PORT || 3000;

const schema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers: resolversArray,
});

async function startApolloServer() {
  await mongoConnect();

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const user = getUserInfo(token.split(" ")[1]);

      return { user };
    },
    introspection: true,
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`GRAPHQL SERVER RUNNING PORT ${PORT} 🚀`);
  });
}

startApolloServer();
