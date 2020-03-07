const express = require('express');
const graphqlHTTP = require('express-graphql');
//Import schema information from graphql folder
const { schema } = require('./db/graphql/schema.js');

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

//
app.listen(PORT, () =>
  console.log(
    `Commons App Express GraphQL server now running on localhost:${PORT}/api`
  )
);
