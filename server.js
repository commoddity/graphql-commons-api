const graphql = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

//Import schema information from graphql folder
const { GraphQLSchema } = graphql;
const { query } = require('./db/graphql/queries');
const { mutation } = require('./db/graphql/mutations');

const schema = new GraphQLSchema({
  query,
  mutation
});

// Define port to run server on
const PORT = 4000;

// Create an express server and a GraphQL endpoint
const app = express();
app.use(
  '/api',
  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
);

// Server launch code
app.listen(PORT, () =>
  console.log(
    `Commons App Express GraphQL server now running on localhost:${PORT}/api`
  )
);
