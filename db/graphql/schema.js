const graphql = require('graphql');
const joinMonster = require('join-monster');

const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'commoddity',
  password: 'development',
  database: 'commons_rebuild'
});
client.connect();

const {
  ParliamentarySession,
  Bill,
  Event,
  Category,
  User
} = require('./models');

const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    parliamentarySessions: {
      type: new graphql.GraphQLList(ParliamentarySession),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    parliamentarySession: {
      type: ParliamentarySession,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (parliamentarySessionTable, args, context) =>
        `${parliamentarySessionTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    bills: {
      type: new graphql.GraphQLList(Bill),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    bill: {
      type: Bill,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (billTable, args, context) => `${billTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    events: {
      type: new graphql.GraphQLList(Event),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    event: {
      type: Event,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (eventTable, args, context) => `${eventTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    categories: {
      type: new graphql.GraphQLList(Category),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    category: {
      type: Category,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (categoryTable, args, context) =>
        `${categoryTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    users: {
      type: new graphql.GraphQLList(User),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    },
    user: {
      type: User,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (userTable, args, context) => `${userTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return client.query(sql);
        });
      }
    }
  })
});

const schema = new graphql.GraphQLSchema({ query: QueryRoot });

module.exports = { schema };
