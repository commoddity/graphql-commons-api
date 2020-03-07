const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} = graphql;
const graphqldate = require('graphql-iso-date');
const { GraphQLDate, GraphQLDateTime } = graphqldate;

const db = require('../../pgAdaptor').db;

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
          console.error(err);
          throw new Error('Failed to insert new parliamentary_session');
        }
      }
    },
    addBill: {
      type: BillType,
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
        const query =
          'INSERT INTO bills (code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const values = [
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
          console.error(err);
          throw new Error('Failed to insert new bill');
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
          console.error(err);
          throw new Error('Failed to insert new event');
        }
      }
    },
    addUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLNonNull(GraphQLString) },
        last_name: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone_number: { type: GraphQLInt },
        email_notification: { type: GraphQLString },
        sms_notification: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const query =
          'INSERT INTO users (first_name, last_name, password, email, phone_number, email_notification, sms_notification, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const values = [
          args.first_name,
          args.last_name,
          args.password,
          args.email,
          args.phone_number,
          args.email_notification,
          args.sms_notification,
          args.active,
          new Date()
        ];
        try {
          const response = await db.query(query, values);
          return response[0];
        } catch (err) {
          console.error(err);
          throw new Error('Failed to insert new user');
        }
      }
    }
  })
});

exports.mutation = RootMutation;
