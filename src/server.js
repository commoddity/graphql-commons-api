// Load in .env variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//Import server/graphql dependencies
const graphql = require('graphql');
const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { environment, serverConf } = require('./config');

// Import dependencies for user authentication
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext } = require('graphql-passport');
const crypto = require('crypto');

// Import schema information from graphql folder
const { GraphQLSchema } = graphql;
const { query } = require('../db/graphql/queries');
const { mutation } = require('../db/graphql/mutations');
const { type } = require('../db/graphql/types');

// Import PostgreSQL connection config
const { db } = require('./pgAdaptor');

// DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
const { hashPassword, compareHashPassword } = require('./helpers/hashHelpers');
// DELETE TO HERE

// Define passport authentication strategy
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const query = 'SELECT id, email, password FROM users;';
    const users = await db.query(query);
    // DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
    const hashedPassword = await hashPassword(password);
    const matchPassword = await compareHashPassword(password, hashedPassword);
    // DELETE TO HERE AND CHANGE matchPassword TO password === user.password BELOW
    const matchingUser = users.find(
      (user) => email === user.email && matchPassword
    );
    const error = matchingUser ? null : new Error('No matching user found.');
    done(error, matchingUser);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const query = 'SELECT id, email, password FROM users;';
  const users = await db.query(query);
  const matchingUser = users.find((user) => user.id === id);
  done(null, matchingUser);
});

// Create an express server
const app = express();

// Define new session params
app.use(
  session({
    genid: (req) => crypto.randomBytes(16).toString('hex'),
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Define new GraphQL schema
const schema = new GraphQLSchema({
  query,
  mutation,
  type
});

// Create a GraphQL endpoint
const server = new ApolloServer({
  schema,
  playground: environment.match('development') ? true : false,
  context: ({ req, res }) => buildContext({ req, res })
});
const path = '/api';

server.applyMiddleware({ app, path });

// Server launch code
app.listen(serverConf.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\nServer running in ${environment} mode and listening on port ${serverConf.SERVER_PORT} ...`
  )
);
