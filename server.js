const express = require('express');
const graphqlHTTP = require('express-graphql');

const { schema } = require('./db/graphql/schema.js');

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

app.listen(4000, () =>
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql')
);
