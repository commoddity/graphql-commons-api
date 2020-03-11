const graphql = require('graphql');
const joinMonster = require('join-monster');
const graphqldate = require('graphql-iso-date');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} = graphql;
const { DateScalar } = require('./scalars.js');
const { GraphQLDateTime } = graphqldate;

const { db } = require('../../src/pgAdaptor');
const {
  ParliamentType,
  ParliamentarySessionType,
  BillType,
  EventType,
  CategoryType,
  UserType
} = require('./types');

//Query Root that uses Join Monster to translate GraphQL queries to SQL
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: () => ({
    parliaments: {
      type: new GraphQLList(ParliamentType),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    parliament: {
      type: ParliamentType,
      args: {
        id: { type: GraphQLInt, sqlColumn: 'id' },
        start_date: { type: DateScalar, sqlColumn: 'start_date' },
        end_date: { type: DateScalar, sqlColumn: 'end_date' },
        created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
      },
      where: (parliamentTable, args, context) =>
        `${parliamentTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    parliamentarySessions: {
      type: new GraphQLList(ParliamentarySessionType),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    parliamentarySession: {
      type: ParliamentarySessionType,
      args: {
        id: { type: GraphQLInt, sqlColumn: 'id' },
        number: { type: GraphQLString, sqlColumn: 'number' },
        start_date: { type: DateScalar, sqlColumn: 'start_date' },
        end_date: { type: DateScalar, sqlColumn: 'end_date' },
        created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
      },
      where: (parliamentarySessionTable, args, context) =>
        `${parliamentarySessionTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    bills: {
      type: new GraphQLList(BillType),
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
        summary_url: { type: GraphQLString },
        page_url: { type: GraphQLString },
        full_text_url: { type: GraphQLString },
        passed: { type: GraphQLBoolean },
        created_at: { type: GraphQLDateTime }
      },
      where: (billTable, args, context) => `${billTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    events: {
      type: new GraphQLList(EventType),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    event: {
      type: EventType,
      args: {
        id: { type: GraphQLInt, sqlColumn: 'id' },
        title: { type: GraphQLString, sqlColumn: 'title' },
        publication_date: { type: DateScalar, sqlColumn: 'publication_date' },
        created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
      },
      where: (eventTable, args, context) => `${eventTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    category: {
      type: CategoryType,
      args: {
        id: { type: GraphQLInt, sqlColumn: 'id' },
        name: { type: GraphQLString, sqlColumn: 'name' },
        uclassify_class: { type: GraphQLString, sqlColumn: 'uclassify_class' },
        created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
      },
      where: (categoryTable, args, context) =>
        `${categoryTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt, sqlColumn: 'id' },
        first_name: {
          type: GraphQLString,
          sqlColumn: 'first_name'
        },
        last_name: {
          type: GraphQLString,
          sqlColumn: 'last_name'
        },
        username: {
          type: GraphQLString,
          sqlColumn: 'username'
        },
        password: {
          type: GraphQLString,
          sqlColumn: 'password'
        },
        email: { type: GraphQLString, sqlColumn: 'email' },
        phone_number: { type: GraphQLInt, sqlColumn: 'phone_number' },
        email_notification: {
          type: GraphQLString,
          sqlColumn: 'email_notification'
        },
        sms_notification: {
          type: GraphQLString,
          sqlColumn: 'sms_notification'
        },
        active: { type: GraphQLBoolean, sqlColumn: 'active' },
        created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
      },
      where: (userTable, args, context) => `${userTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.query(sql);
        });
      }
    }
  })
});

exports.query = RootQuery;
