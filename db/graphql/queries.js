const graphql = require('graphql');
const joinMonster = require('join-monster');
const graphqldate = require('graphql-iso-date');

const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } = graphql;
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
        id: { type: GraphQLNonNull(GraphQLInt) }
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
