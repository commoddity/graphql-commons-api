const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

//GraphQL tables are defined below

// Parliamentary Sessions
const ParliamentarySession = new GraphQLObjectType({
  name: 'ParliamentarySession',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    number: { type: GraphQLNonNull(GraphQLString) },
    start_date: { type: GraphQLDate },
    end_date: { type: GraphQLDate },
    bills: {
      type: GraphQLList(Bill),
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    }
  })
});

ParliamentarySession._typeConfig = {
  sqlTable: 'parliamentary_sessions',
  uniqueKey: 'id'
};

// Bills
const Bill = new GraphQLObjectType({
  name: 'Bill',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    parliamentary_session: {
      type: ParliamentarySession,
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    },
    code: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    introduced_date: { type: GraphQLDate },
    summary_url: { type: GraphQLString },
    page_url: { type: GraphQLString },
    full_text_url: { type: GraphQLString },
    passed: { type: GraphQLBoolean },
    created_at: { type: GraphQLDateTime },
    events: {
      type: GraphQLList(Event),
      sqlJoin: (billTable, eventTable, args) =>
        `${billTable}.id = ${eventTable}.bill_id`
    },
    categories: {
      type: GraphQLList(Category),
      sqlJoin: (billTable, categoryTable, args) =>
        `${billTable}.id = ${categoryTable}.bill_id`
    },
    users: {
      type: GraphQLList(User),
      sqlJoin: (billTable, userTable, args) =>
        `${billTable}.id = ${userTable}.bill_id`
    }
  })
});

Bill._typeConfig = {
  sqlTable: 'bills',
  uniqueKey: 'id'
};

// Events
const Event = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    bill_id: {
      type: Bill,
      sqlJoin: (eventTable, billTable, args) =>
        `${eventTable}.bill_id = ${billTable}.id`
    },
    code: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    publication_date: { type: GraphQLDate },
    created_at: { type: GraphQLDateTime }
  })
});

Event._typeConfig = {
  sqlTable: 'events',
  uniqueKey: 'id'
};

// Categories
const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    uclassify_class: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    users: {
      type: GraphQLList(User),
      sqlJoin: (categoryTable, userTable, args) =>
        `${categoryTable}.id = ${userTable}.category_id`
    },
    bills: {
      type: GraphQLList(Bill),
      sqlJoin: (categoryTable, billTable, args) =>
        `${categoryTable}.id = ${billTable}.category_id`
    }
  })
});

Category._typeConfig = {
  sqlTable: 'categories',
  uniqueKey: 'id'
};

// Users
const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLInt },
    email_notification: { type: GraphQLString },
    sms_notification: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    created_at: { type: GraphQLDateTime },
    bills: {
      type: GraphQLList(Bill),
      sqlJoin: (userTable, billTable, args) =>
        `${userTable}.id = ${billTable}.user_id`
    },
    categories: {
      type: GraphQLList(Category),
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
