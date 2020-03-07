const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const joinMonster = require('join-monster');

// PSQL connection information
const { Client } = require('pg');
const client = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});
client.connect();

const {
  ParliamentarySession,
  Bill,
  Event,
  Category,
  User
} = require('./models');

//Query Root that uses Join Monster to translate GraphQL queries to SQL
const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    parliamentarySessions: {
      type: new GraphQLList(ParliamentarySession),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    parliamentarySession: {
      type: ParliamentarySession,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (parliamentarySessionTable, args, context) =>
        `${parliamentarySessionTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    bills: {
      type: new GraphQLList(Bill),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    bill: {
      type: Bill,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (billTable, args, context) => `${billTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    events: {
      type: new GraphQLList(Event),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    event: {
      type: Event,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (eventTable, args, context) => `${eventTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    categories: {
      type: new GraphQLList(Category),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    category: {
      type: Category,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (categoryTable, args, context) =>
        `${categoryTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    users: {
      type: new GraphQLList(User),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    user: {
      type: User,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      where: (userTable, args, context) => `${userTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    }
  })
});

// MutationRoot stores mutations for creating/updating data in the database
const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    parliamentarySession: {
      type: ParliamentarySession,
      args: {
        number: { type: GraphQLNonNull(GraphQLString) },
        start_date: { type: GraphQLDate },
        end_date: { type: GraphQLDate }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await client.query(
              'INSERT INTO parliamentary_sessions (number, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
              [args.number, args.start_date, args.end_date]
            )
          ).rows[0];
        } catch (err) {
          throw new Error('Failed to insert new parliamentary_session');
        }
      }
    },
    bill: {
      type: Bill,
      args: {
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
        try {
          return (
            await client.query(
              'INSERT INTO bills (code, title, description, introduced_date, summary_url, page_url, full_text_url, passed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
              [
                args.code,
                args.title,
                args.description,
                args.introduced_date,
                args.summary_url,
                args.page_url,
                args.full_text_url,
                args.passed
              ]
            )
          ).rows[0];
        } catch (err) {
          throw new Error('Failed to insert new bill');
        }
      }
    },
    event: {
      type: Event,
      args: {
        code: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        publication_date: { type: GraphQLDate }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await client.query(
              'INSERT INTO events (code, title, publication_date) VALUES ($1, $2, $3) RETURNING *',
              [args.code, args.title, args.publication_date]
            )
          ).rows[0];
        } catch (err) {
          throw new Error('Failed to insert new event');
        }
      }
    },
    user: {
      type: User,
      args: {
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone_number: { type: GraphQLInt },
        email_notification: { type: GraphQLString },
        sms_notification: { type: GraphQLString },
        active: { type: GraphQLBoolean }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await client.query(
              'INSERT INTO events (first_name, last_name, password, email, phone_number, email_notification, sms_notification, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
              [
                args.first_name,
                args.last_name,
                args.password,
                args.email,
                args.phone_number,
                args.email_notification,
                args.sms_notification,
                args.active
              ]
            )
          ).rows[0];
        } catch (err) {
          throw new Error('Failed to insert new user');
        }
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot
});

module.exports = { schema };
