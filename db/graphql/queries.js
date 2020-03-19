const graphql = require('graphql');
const joinMonster = require('join-monster');
const sqlString = require('sqlstring');

const { getHeaderAndParseCookie } = require('../../src/helpers/parseHelpers');

// GraphQL Data Types
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString
} = graphql;
const { NotificationEnumType } = require('./enums.js');
const { DateScalar } = require('./scalars.js');

// GraphQL Types
const {
  ParliamentType,
  ParliamentarySessionType,
  BillType,
  EventType,
  CategoryType,
  UserType
} = require('./types');

// Database Connection
const { db } = require('../../src/pgAdaptor');

//Query Root that uses Join Monster to translate GraphQL queries to SQL
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: () => ({
    // Parliament Type Queries
    parliaments: {
      type: new GraphQLList(ParliamentType),
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      where: (parliamentsTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${parliamentsTable}.id = ?`);
          values.push(args.id);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    parliament: {
      type: ParliamentType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      where: (parliamentTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${parliamentTable}.id = ?`);
          values.push(args.id);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // Parliamentary Session Type Queries
    parliamentarySessions: {
      type: new GraphQLList(ParliamentarySessionType),
      args: {
        id: { type: GraphQLInt },
        parliament_id: { type: GraphQLInt },
        number: { type: GraphQLInt }
      },
      where: (parliamentarySessionsTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${parliamentarySessionsTable}.id = ?`);
          values.push(args.id);
        }
        if (args.parliament_id) {
          whereClause.push(`${parliamentarySessionsTable}.parliament_id = ?`);
          values.push(args.parliament_id);
        }
        if (args.number) {
          whereClause.push(`${parliamentarySessionsTable}.number = ?`);
          values.push(args.number);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    parliamentarySession: {
      type: ParliamentarySessionType,
      args: {
        id: { type: GraphQLInt },
        parliament_id: { type: GraphQLInt },
        number: { type: GraphQLInt }
      },
      where: (parliamentarySessionTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${parliamentarySessionTable}.id = ?`);
          values.push(args.id);
        }
        if (args.parliament_id) {
          whereClause.push(`${parliamentarySessionTable}.parliament_id = ?`);
          values.push(args.parliament_id);
        }
        if (args.number) {
          whereClause.push(`${parliamentarySessionTable}.number = ?`);
          values.push(args.number);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // Bill Type Queries
    bills: {
      type: new GraphQLList(BillType),
      args: {
        id: { type: GraphQLInt },
        parliamentary_session_id: { type: GraphQLInt },
        code: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        introduced_date: { type: DateScalar },
        passed: { type: GraphQLBoolean }
      },
      where: (billsTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${billsTable}.id = ?`);
          values.push(args.id);
        }
        if (args.parliamentary_session_id) {
          whereClause.push(`${billsTable}.parliamentary_session_id = ?`);
          values.push(args.parliamentary_session_id);
        }
        if (args.code) {
          whereClause.push(`${billsTable}.code = ?`);
          values.push(args.code);
        }
        if (args.title) {
          whereClause.push(`${billsTable}.title = ?`);
          values.push(args.title);
        }
        if (args.description) {
          whereClause.push(`${billsTable}.description = ?`);
          values.push(args.description);
        }
        if (args.introduced_date) {
          whereClause.push(`${billsTable}.introduced_date = ?`);
          values.push(args.introduced_date);
        }
        if (args.passed) {
          whereClause.push(`${billsTable}.passed = ?`);
          values.push(args.passed);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    bill: {
      type: BillType,
      args: {
        id: { type: GraphQLInt },
        parliamentary_session_id: { type: GraphQLInt },
        code: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        introduced_date: { type: DateScalar },
        passed: { type: GraphQLBoolean }
      },
      where: (billTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${billTable}.id = ?`);
          values.push(args.id);
        }
        if (args.parliamentary_session_id) {
          whereClause.push(`${billTable}.parliamentary_session_id = ?`);
          values.push(args.parliamentary_session_id);
        }
        if (args.code) {
          whereClause.push(`${billTable}.code = ?`);
          values.push(args.code);
        }
        if (args.title) {
          whereClause.push(`${billTable}.title = ?`);
          values.push(args.title);
        }
        if (args.description) {
          whereClause.push(`${billTable}.description = ?`);
          values.push(args.description);
        }
        if (args.introduced_date) {
          whereClause.push(`${billTable}.introduced_date = ?`);
          values.push(args.introduced_date);
        }
        if (args.passed) {
          whereClause.push(`${billTable}.passed = ?`);
          values.push(args.passed);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // Event Type Queries
    events: {
      type: new GraphQLList(EventType),
      args: {
        id: { type: GraphQLInt },
        bill_code: { type: GraphQLString },
        title: { type: GraphQLString },
        publication_date: { type: DateScalar }
      },
      where: (eventsTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${eventsTable}.id = ?`);
          values.push(args.id);
        }
        if (args.bill_code) {
          whereClause.push(`${eventsTable}.bill_code = ?`);
          values.push(args.bill_code);
        }
        if (args.title) {
          whereClause.push(`${eventsTable}.title = ?`);
          values.push(args.title);
        }
        if (args.publication_date) {
          whereClause.push(`${eventsTable}.publication_date = ?`);
          values.push(args.publication_date);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    event: {
      type: EventType,
      args: {
        id: { type: GraphQLInt },
        bill_code: { type: GraphQLString },
        title: { type: GraphQLString },
        publication_date: { type: DateScalar }
      },
      where: (eventTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${eventTable}.id = ?`);
          values.push(args.id);
        }
        if (args.bill_code) {
          whereClause.push(`${eventTable}.bill_code = ?`);
          values.push(args.bill_code);
        }
        if (args.title) {
          whereClause.push(`${eventTable}.title = ?`);
          values.push(args.title);
        }
        if (args.publication_date) {
          whereClause.push(`${eventTable}.publication_date = ?`);
          values.push(args.publication_date);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // Category Type Queries
    categories: {
      type: new GraphQLList(CategoryType),
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        uclassify_class: { type: GraphQLString }
      },
      where: (categoriesTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${categoriesTable}.id = ?`);
          values.push(args.id);
        }
        if (args.name) {
          whereClause.push(`${categoriesTable}.name = ?`);
          values.push(args.name);
        }
        if (args.uclassify_class) {
          whereClause.push(`${categoriesTable}.uclassify_class = ?`);
          values.push(args.uclassify_class);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    category: {
      type: CategoryType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        uclassify_class: { type: GraphQLString }
      },
      where: (categoryTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${categoryTable}.id = ?`);
          values.push(args.id);
        }
        if (args.name) {
          whereClause.push(`${categoryTable}.name = ?`);
          values.push(args.name);
        }
        if (args.uclassify_class) {
          whereClause.push(`${categoryTable}.uclassify_class = ?`);
          values.push(args.uclassify_class);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // User Type Queries
    users: {
      type: new GraphQLList(UserType),
      args: {
        id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLInt },
        email_notification: { type: NotificationEnumType },
        sms_notification: { type: NotificationEnumType },
        active: { type: GraphQLBoolean }
      },
      where: (usersTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${usersTable}.id = ?`);
          values.push(args.id);
        }
        if (args.first_name) {
          whereClause.push(`${usersTable}.first_name = ?`);
          values.push(args.first_name);
        }
        if (args.last_name) {
          whereClause.push(`${usersTable}.last_name = ?`);
          values.push(args.last_name);
        }
        if (args.username) {
          whereClause.push(`${usersTable}.username = ?`);
          values.push(args.username);
        }
        if (args.email) {
          whereClause.push(`${usersTable}.email = ?`);
          values.push(args.email);
        }
        if (args.phone_number) {
          whereClause.push(`${usersTable}.phone_number = ?`);
          values.push(args.phone_number);
        }
        if (args.email_notification) {
          whereClause.push(`${usersTable}.email_notification = ?`);
          values.push(args.email_notification);
        }
        if (args.sms_notification) {
          whereClause.push(`${usersTable}.sms_notification = ?`);
          values.push(args.sms_notification);
        }
        if (args.active) {
          whereClause.push(`${usersTable}.active = ?`);
          values.push(args.active);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLInt },
        email_notification: { type: NotificationEnumType },
        sms_notification: { type: NotificationEnumType },
        active: { type: GraphQLBoolean }
      },
      where: (userTable, args, context) => {
        const whereClause = [];
        const values = [];
        if (args.id) {
          whereClause.push(`${userTable}.id = ?`);
          values.push(args.id);
        }
        if (args.first_name) {
          whereClause.push(`${userTable}.first_name = ?`);
          values.push(args.first_name);
        }
        if (args.last_name) {
          whereClause.push(`${userTable}.last_name = ?`);
          values.push(args.last_name);
        }
        if (args.username) {
          whereClause.push(`${userTable}.username = ?`);
          values.push(args.username);
        }
        if (args.email) {
          whereClause.push(`${userTable}.email = ?`);
          values.push(args.email);
        }
        if (args.postal_code) {
          whereClause.push(`${userTable}.postal_code = ?`);
          values.push(args.postal_code);
        }
        if (args.phone_number) {
          whereClause.push(`${userTable}.phone_number = ?`);
          values.push(args.phone_number);
        }
        if (args.email_notification) {
          whereClause.push(`${userTable}.email_notification = ?`);
          values.push(args.email_notification);
        }
        if (args.sms_notification) {
          whereClause.push(`${userTable}.sms_notification = ?`);
          values.push(args.sms_notification);
        }
        if (args.active) {
          whereClause.push(`${userTable}.active = ?`);
          values.push(args.active);
        }
        const escapedString = sqlString.format(
          whereClause.join(' AND '),
          values
        );
        return escapedString;
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    // NEED TO FIGURE OUT WAY TO GET USER ID FROM SESSION AND/OR CONTEXT
    currentUser: {
      type: UserType,
      resolve: (parent, args, context, resolveInfo) => {
        console.log(context);
        const userId = context.req.session.passport.user;
        console.log(context.req.session.passport.user);
        return userId;
      }
    }
  })
});

exports.query = RootQuery;
