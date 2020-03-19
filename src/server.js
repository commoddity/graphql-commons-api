// Load in .env variables
require('dotenv').config();

//Import server/graphql dependencies
const graphql = require('graphql');
const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const { environment, serverConf } = require('./config');
const cors = require('cors');

// Import dependencies for user authentication
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext } = require('graphql-passport');
const crypto = require('crypto');
const uuid = require('node-uuid');

// Import schema information from graphql folder
const { GraphQLSchema } = graphql;
const { query } = require('../db/graphql/queries');
const { mutation } = require('../db/graphql/mutations');
const { type } = require('../db/graphql/types');

// Import PostgreSQL connection for user authentication
const { db } = require('./pgAdaptor');

// Bcrypt helper for hashed password authentication
const { compareHashPassword } = require('./helpers/hashHelpers');

// Define passport authentication strategy
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const query = 'SELECT id, email, password FROM users WHERE email = $1';
    const [user] = await db.query(query, [email]);
    if (!user) {
      const error = new Error(`No user found for ${email}.`);
      done(error, false);
    } else {
      const matchPassword = await compareHashPassword(password, user.password);
      const error = matchPassword
        ? null
        : new Error(`Incorrect password for ${email}.`);
      matchPassword ? done(error, user) : done(error, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const query = 'SELECT id FROM users WHERE id = $1';
  const [user] = await db.query(query, [id]);
  done(null, user);
});

// Create an express server
const app = express();

// Setup CORS options
const corsOptions = {
  origin: process.env.COMMONS_FRONT_END,
  credentials: true
};
app.use(cors(corsOptions));

// Define new session params
app.use(
  session({
    genid: function(req) {
      return crypto
        .createHash('sha256')
        .update(uuid.v1())
        .update(crypto.randomBytes(256))
        .digest('hex');
    },
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
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

server.applyMiddleware({ app, path, cors: false });

// Server launch code
app.listen(serverConf.SERVER_PORT, () =>
  console.log(
    `Commons App Express GraphQL API now running ...\nServer running in ${environment} mode and listening on port ${serverConf.SERVER_PORT} ...`
  )
);
