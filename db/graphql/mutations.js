require('dotenv/config');
const graphql = require('graphql');
const graphqldate = require('graphql-iso-date');

// DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
const {
  hashPassword,
  compareHashPassword
} = require('../../src/helpers/hashHelpers');

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} = graphql;
const { GraphQLDate, GraphQLDateTime } = graphqldate;

const { db } = require('../../src/pgAdaptor');
const {
  ParliamentarySessionType,
  BillType,
  EventType,
  UserType
} = require('./types');

// MutationRoot stores mutations for creating/updating data in the database
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    addParliamentarySession: {
      type: ParliamentarySessionType,
      args: {
        number: { type: GraphQLNonNull(GraphQLString) },
        start_date: { type: GraphQLDate },
        end_date: { type: GraphQLDate }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const query =
          'INSERT INTO parliamentary_sessions (number, start_date, end_date, created_at) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [
          args.number,
          args.start_date,
          args.end_date,
          new Date()
        ];
        try {
          const response = await db.query(query, values);
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new parliamentary_session. ${err}`);
          throw new Error(`Failed to insert new parliamentary_session. ${err}`);
        }
      }
    },
    addBill: {
      type: BillType,
      args: {
        parliamentary_session_id: { type: GraphQLNonNull(GraphQLInt) },
        code: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        introduced_date: { type: GraphQLDate },
        summary_url: { type: GraphQLString },
        page_url: { type: GraphQLString },
        full_text_url: { type: GraphQLString },
        passed: { type: GraphQLBoolean }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const query =
          'INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        const values = [
          args.parliamentary_session_id,
          args.code,
          args.title,
          args.description,
          args.introduced_date,
          args.summary_url,
          args.page_url,
          args.full_text_url,
          args.passed,
          new Date()
        ];
        try {
          const response = await db.query(query, values);
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new bill. ${err}`);
          throw new Error(`Failed to insert new bill. ${err}`);
        }
      }
    },
    addEvent: {
      type: EventType,
      args: {
        code: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        publication_date: { type: GraphQLDate }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const query =
          'INSERT INTO events (code, title, publication_date, created_at) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [
          args.code,
          args.title,
          args.publication_date,
          new Date()
        ];
        try {
          const response = await db.query(query, values);
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new event. ${err}`);
          throw new Error(`Failed to insert new event. ${err}`);
        }
      }
    },
    addUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone_number: { type: GraphQLInt },
        email_notification: { type: GraphQLString },
        sms_notification: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        // DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
        const hashedPassword = await hashPassword(args.password);
        const query =
          'INSERT INTO users (first_name, last_name, username, password, email, phone_number, email_notification, sms_notification, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        const values = [
          args.first_name,
          args.last_name,
          args.username,
          // DEV NOTE ---> CHANGE BACK TO args.password ONCE FRONT END BCRYPT HASHING IS SET UP
          hashedPassword,
          args.email,
          args.phone_number,
          args.email_notification,
          args.sms_notification,
          args.active,
          new Date()
        ];
        try {
          const response = await db.query(query, values);
          console.log(
            `Successfully added user ${args.first_name} ${args.last_name} to database.`
          );
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new user. ${err}`);
          throw new Error(`Failed to insert new user. ${err}`);
        }
      }
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const { email, password } = args;
        // DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
        const hashedPassword = await hashPassword(password);
        const matchPassword = await compareHashPassword(
          password,
          hashedPassword
        );
        console.log(`DEV ---> PASSWORD MATCH IS ${matchPassword}`);
        // DEV NOTE ---> DELETE IF STATEMENT ONCE FRONT END BCRYPT HASHING IS SET UP
        if (matchPassword) {
          try {
            const { user } = await context.authenticate('graphql-local', {
              email,
              password
            });
            await context.login(user);
            console.log(`User successfully logged in using email: ${email}`);
            return user;
          } catch (err) {
            console.error(`Failed to log in user with email: ${email}. ${err}`);
            throw new Error(
              `Failed to log in user with email: ${email}. ${err}`
            );
          }
        }
      }
    },
    logoutUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          await context.logout();
          console.log(`Successfully logged out user with id ${args.id}`);
        } catch (err) {
          console.error(`Failed to log out user. ${err}`);
          throw new Error(`Failed to log out user. ${err}`);
        }
      }
    }
  })
});

exports.mutation = RootMutation;
