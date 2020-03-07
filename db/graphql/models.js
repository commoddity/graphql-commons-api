const graphql = require('graphql');
const graphqldate = require('graphql-iso-date');

const ParliamentarySession = new graphql.GraphQLObjectType({
  name: 'ParliamentarySession',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    number: { type: graphql.GraphQLString },
    start_date: { type: graphqldate.GraphQLDate },
    end_date: { type: graphqldate.GraphQLDate },
    bills: {
      type: graphql.GraphQLList(Bill),
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    }
  })
});

ParliamentarySession._typeConfig = {
  sqlTable: 'parliamentary_sessions',
  uniqueKey: 'id'
};

const Bill = new graphql.GraphQLObjectType({
  name: 'Bill',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    parliamentary_session: {
      type: ParliamentarySession,
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    },
    code: { type: graphql.GraphQLString },
    title: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    introduced_date: { type: graphqldate.GraphQLDate },
    summary_url: { type: graphql.GraphQLString },
    page_url: { type: graphql.GraphQLString },
    full_text_url: { type: graphql.GraphQLString },
    passed: { type: graphql.GraphQLBoolean },
    created_at: { type: graphqldate.GraphQLDateTime },
    events: {
      type: graphql.GraphQLList(Event),
      sqlJoin: (billTable, eventTable, args) =>
        `${billTable}.id = ${eventTable}.bill_id`
    },
    categories: {
      type: graphql.GraphQLList(Category),
      sqlJoin: (billTable, categoryTable, args) =>
        `${billTable}.id = ${categoryTable}.bill_id`
    },
    users: {
      type: graphql.GraphQLList(User),
      sqlJoin: (billTable, userTable, args) =>
        `${billTable}.id = ${userTable}.bill_id`
    }
  })
});

Bill._typeConfig = {
  sqlTable: 'bills',
  uniqueKey: 'id'
};

const Event = new graphql.GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    bill_id: {
      type: Bill,
      sqlJoin: (eventTable, billTable, args) =>
        `${eventTable}.bill_id = ${billTable}.id`
    },
    code: { type: graphql.GraphQLString },
    title: { type: graphql.GraphQLString },
    publication_date: { type: graphqldate.GraphQLDate },
    created_at: { type: graphqldate.GraphQLDateTime }
  })
});

Event._typeConfig = {
  sqlTable: 'events',
  uniqueKey: 'id'
};

const Category = new graphql.GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    uclassify_class: { type: graphql.GraphQLString },
    created_at: { type: graphqldate.GraphQLDateTime },
    users: {
      type: graphql.GraphQLList(User),
      sqlJoin: (categoryTable, userTable, args) =>
        `${categoryTable}.id = ${userTable}.category_id`
    },
    bills: {
      type: graphql.GraphQLList(Bill),
      sqlJoin: (categoryTable, billTable, args) =>
        `${categoryTable}.id = ${billTable}.category_id`
    }
  })
});

Category._typeConfig = {
  sqlTable: 'categories',
  uniqueKey: 'id'
};

const User = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    password: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    phone_number: { type: graphql.GraphQLInt },
    email_notification: { type: graphql.GraphQLString },
    sms_notification: { type: graphql.GraphQLString },
    active: { type: graphql.GraphQLBoolean },
    created_at: { type: graphqldate.GraphQLDateTime },
    bills: {
      type: graphql.GraphQLList(Bill),
      sqlJoin: (userTable, billTable, args) =>
        `${userTable}.id = ${billTable}.user_id`
    },
    categories: {
      type: graphql.GraphQLList(Category),
      sqlJoin: (userTable, categoryTable, args) =>
        `${userTable}.id = ${categoryTable}.user_id`
    }
  })
});

User._typeConfig = {
  sqlTable: 'users',
  uniqueKey: 'id'
};

module.exports = { ParliamentarySession, Bill, Event, Category, User };
