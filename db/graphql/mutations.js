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
const { DateScalar } = require('./scalars.js');
const { NotificationEnumType } = require('./enums.js');
const { GraphQLDateTime } = graphqldate;

const { db } = require('../../src/pgAdaptor');
const {
  ParliamentType,
  ParliamentarySessionType,
  BillType,
  EventType,
  UserType,
  BillCategoryType,
  UserBillType,
  UserCategoryType
} = require('./types');

// MutationRoot stores mutations for creating/updating data in the database
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: () => ({
    addParliament: {
      type: ParliamentType,
      args: {
        start_date: { type: DateScalar },
        end_date: { type: DateScalar },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO parliaments (start_date, end_date, created_at) 
            VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [args.start_date, args.end_date];
          const response = await db.query(query, values);
          console.log(`Successfully added new parliament to database.`);
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new parliament. ${err}`);
          throw new Error(`Failed to insert new parliament. ${err}`);
        }
      }
    },
    addParliamentarySession: {
      type: ParliamentarySessionType,
      args: {
        parliament_id: { type: GraphQLNonNull(GraphQLInt) },
        number: { type: GraphQLNonNull(GraphQLString) },
        start_date: { type: DateScalar },
        end_date: { type: DateScalar },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO parliamentary_sessions (parliament_id, number, start_date, end_date, created_at) 
            VALUES ($1, $2, $3, $4, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [
            args.parliament_id,
            args.number,
            args.start_date,
            args.end_date
          ];
          const response = await db.query(query, values);
          console.log(
            `Successfully added parliamentary session ${args.number} to database.`
          );
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
        description: { type: GraphQLString },
        introduced_date: { type: DateScalar },
        summary_url: { type: GraphQLString },
        page_url: { type: GraphQLString },
        full_text_url: { type: GraphQLString },
        passed: { type: GraphQLBoolean },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [
            args.parliamentary_session_id,
            args.code,
            args.title,
            args.description,
            args.introduced_date,
            args.summary_url,
            args.page_url,
            args.full_text_url,
            args.passed
          ];
          const response = await db.query(query, values);
          console.log(`Successfully added Bill ${args.code} to database.`);
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
        bill_code: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        publication_date: { type: DateScalar },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO events (bill_code, title, publication_date, created_at) 
            VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [args.bill_code, args.title, args.publication_date];
          const response = await db.query(query, values);
          console.log(
            `Successfully added event for Bill ${args.bill_code} to database.`
          );
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
        email_notification: { type: NotificationEnumType },
        sms_notification: { type: NotificationEnumType },
        active: { type: GraphQLBoolean },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          // DEV NOTE ---> DELETE FOLLOWING ONCE FRONT END BCRYPT HASHING IS SET UP
          const hashedPassword = await hashPassword(args.password);
          const query = `INSERT INTO users (first_name, last_name, username, password, email, phone_number, email_notification, sms_notification, active, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
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
            true
          ];
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
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `DELETE FROM users 
                        WHERE (id = $1)`;
          const values = [args.id];
          const response = await db.query(query, values);
          console.log(
            `Successfully deleted user with id ${args.id} from database.`
          );
          return response[0];
        } catch (err) {
          console.error(`Failed to delete user. ${err}`);
          throw new Error(`Failed to delete user. ${err}`);
        }
      }
    },
    addBillCategory: {
      type: BillCategoryType,
      args: {
        bill_id: { type: GraphQLNonNull(GraphQLInt) },
        category_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO bill_categories (bill_id, category_id, created_at) 
            VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [args.bill_id, args.category_id];
          const response = await db.query(query, values);
          console.log('Successfully added bill category.');
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new bill category. ${err}`);
          throw new Error(`Failed to insert new bill category. ${err}`);
        }
      }
    },
    removeBillCategory: {
      type: BillCategoryType,
      args: {
        bill_id: { type: GraphQLNonNull(GraphQLInt) },
        category_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `DELETE FROM bill_categories 
            WHERE (bill_id = $1) AND (category_id = $2)`;
          const values = [args.bill_id, args.category_id];
          const response = await db.query(query, values);
          console.log('Successfully deleted bill category.');
          return response[0];
        } catch (err) {
          console.error(`Failed to delete bill category. ${err}`);
          throw new Error(`Failed to delete bill category. ${err}`);
        }
      }
    },
    addUserBill: {
      type: UserBillType,
      args: {
        user_id: { type: GraphQLNonNull(GraphQLInt) },
        bill_id: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO user_bills (user_id, bill_id, created_at) 
            VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [args.user_id, args.bill_id];
          const response = await db.query(query, values);
          console.log('Successfully added user bill.');
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new user bill. ${err}`);
          throw new Error(`Failed to insert new user bill. ${err}`);
        }
      }
    },
    deleteUserBill: {
      type: UserBillType,
      args: {
        user_id: { type: GraphQLInt },
        bill_id: { type: GraphQLInt }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `DELETE FROM user_bills 
            WHERE (user_id = $1) AND (bill_id = $2)`;
          const values = [args.user_id, args.bill_id];
          const response = await db.query(query, values);
          console.log('Successfully deleted user bill.');
          return response[0];
        } catch (err) {
          console.error(`Failed to delete user bill. ${err}`);
          throw new Error(`Failed to delete user bill. ${err}`);
        }
      }
    },
    addUserCategory: {
      type: UserCategoryType,
      args: {
        user_id: { type: GraphQLNonNull(GraphQLInt) },
        category_id: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLDateTime }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `INSERT INTO user_categories (user_id, category_id, created_at) 
            VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0))) 
            RETURNING *`;
          const values = [args.user_id, args.category_id];
          const response = await db.query(query, values);
          console.log('Successfully added user category.');
          return response[0];
        } catch (err) {
          console.error(`Failed to insert new user category. ${err}`);
          throw new Error(`Failed to insert new user category. ${err}`);
        }
      }
    },
    removeUserCategory: {
      type: UserCategoryType,
      args: {
        user_id: { type: GraphQLNonNull(GraphQLInt) },
        category_id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const query = `DELETE FROM user_bills 
            WHERE (user_id = $1) AND (category_id = $2)`;
          const values = [args.user_id, args.category_id];
          const response = await db.query(query, values);
          console.log('Successfully deleted user category.');
          return response[0];
        } catch (err) {
          console.error(`Failed to delete user bill. ${err}`);
          throw new Error(`Failed to delete user bill. ${err}`);
        }
      }
    },
    // Login and logout mutations
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
