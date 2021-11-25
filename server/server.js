const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

// function to run on server start
const startServer = async () => {
  // create new Apollo server, pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  // Start Apollo Server
  await server.start();

  // integrate Apollo server with Express application
  server.applyMiddleware({ app });

  // confirm where we can test GQL API in console
  console.log(
    `GraphQL queries and mutations can be tested at http://localhost:${PORT}${server.graphqlPath}`
  );
};

// Initialize Apollo server
startServer();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

db.once("open", () => {
  app.listen(PORT, () =>
    console.log(`🌍 Now listening to book search on localhost:${PORT}`)
  );
});
