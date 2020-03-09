const graphql = require('graphql');
const graphqldate = require('graphql-iso-date');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = graphql;
const { GraphQLDate, GraphQLDateTime } = graphqldate;

//GraphQL types are defined below

// Parliamentary Sessions
const ParliamentarySessionType = new GraphQLObjectType({
  name: 'ParliamentarySession',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    number: { type: GraphQLNonNull(GraphQLString) },
    start_date: { type: GraphQLDate },
    end_date: { type: GraphQLDate },
    bills: {
      type: GraphQLList(BillType),
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    }
  })
});

ParliamentarySessionType._typeConfig = {
  sqlTable: 'parliamentary_sessions',
  uniqueKey: 'id'
};

// Bills
const BillType = new GraphQLObjectType({
  name: 'Bill',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    parliamentary_session: {
      type: ParliamentarySessionType,
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
      type: GraphQLList(EventType),
      sqlJoin: (billTable, eventTable, args) =>
        `${billTable}.id = ${eventTable}.bill_id`
    },
    categories: {
      type: GraphQLList(CategoryType),
      sqlJoin: (billTable, categoryTable, args) =>
        `${billTable}.id = ${categoryTable}.bill_id`
    },
    users: {
      type: GraphQLList(UserType),
      sqlJoin: (billTable, userTable, args) =>
        `${billTable}.id = ${userTable}.bill_id`
    }
  })
});

BillType._typeConfig = {
  sqlTable: 'bills',
  uniqueKey: 'id'
};

// Events
const EventType = new GraphQLObjectType({
  name: 'Event',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    bill_id: {
      type: BillType,
      sqlJoin: (eventTable, billTable, args) =>
        `${eventTable}.bill_id = ${billTable}.id`
    },
    code: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    publication_date: { type: GraphQLDate },
    created_at: { type: GraphQLDateTime }
  })
});

EventType._typeConfig = {
  sqlTable: 'events',
  uniqueKey: 'id'
};

// Categories
const CategoryType = new GraphQLObjectType({
  name: 'Category',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    uclassify_class: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    users: {
      type: GraphQLList(UserType),
      sqlJoin: (categoryTable, userTable, args) =>
        `${categoryTable}.id = ${userTable}.category_id`
    },
    bills: {
      type: GraphQLList(BillType),
      sqlJoin: (categoryTable, billTable, args) =>
        `${categoryTable}.id = ${billTable}.category_id`
    }
  })
});

CategoryType._typeConfig = {
  sqlTable: 'categories',
  uniqueKey: 'id'
};

// Users
const UserType = new GraphQLObjectType({
  name: 'User',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    first_name: { type: GraphQLNonNull(GraphQLString) },
    last_name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone_number: { type: GraphQLInt },
    email_notification: { type: GraphQLString },
    sms_notification: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    created_at: { type: GraphQLDateTime },
    bills: {
      type: GraphQLList(BillType),
      sqlJoin: (userTable, billTable, args) =>
        `${userTable}.id = ${billTable}.user_id`
    },
    categories: {
      type: GraphQLList(CategoryType),
      sqlJoin: (userTable, categoryTable, args) =>
        `${userTable}.id = ${categoryTable}.user_id`
    }
  })
});

UserType._typeConfig = {
  sqlTable: 'users',
  uniqueKey: 'id'
};

exports.ParliamentarySessionType = ParliamentarySessionType;
exports.BillType = BillType;
exports.EventType = EventType;
exports.CategoryType = CategoryType;
exports.UserType = UserType;
