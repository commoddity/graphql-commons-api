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
const { DateScalar } = require('./scalars.js');
const { notificationEnumType } = require('./enums.js');
const { GraphQLDateTime } = graphqldate;

//GraphQL types are defined below

// Parliamentary Sessions
const ParliamentType = new GraphQLObjectType({
  name: 'Parliament',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    start_date: { type: DateScalar, sqlColumn: 'start_date' },
    end_date: { type: DateScalar, sqlColumn: 'end_date' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' },
    parliamentary_sessions: {
      description: 'Parliamentary sessions for this parliament',
      type: GraphQLList(BillType),
      sqlJoin: (parliamentarySessionTable, parliamentTable, args) =>
        `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`
    }
  })
});

ParliamentType._typeConfig = {
  sqlTable: 'parliaments',
  uniqueKey: 'id'
};

const ParliamentarySessionType = new GraphQLObjectType({
  name: 'ParliamentarySession',
  type: 'Query',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    parliament: {
      type: ParliamentType,
      sqlColumn: 'parliament_id',
      sqlJoin: (parliamentarySessionTable, parliamentTable, args) =>
        `${parliamentarySessionTable}.parliament_id = ${parliamentTable}.id`
    },
    number: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'number' },
    start_date: { type: DateScalar, sqlColumn: 'start_date' },
    end_date: { type: DateScalar, sqlColumn: 'end_date' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' },
    bills: {
      description: 'Bills for this parliamentary session',
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
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    parliamentary_session: {
      type: ParliamentarySessionType,
      sqlColumn: 'parliamentary_session_id',
      sqlJoin: (billTable, parliamentarySessionTable, args) =>
        `${billTable}.parliamentary_session_id = ${parliamentarySessionTable}.id`
    },
    code: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'code' },
    title: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'title' },
    description: {
      type: GraphQLString,
      sqlColumn: 'description'
    },
    introduced_date: { type: DateScalar, sqlColumn: 'introduced_date' },
    summary_url: { type: GraphQLString, sqlColumn: 'summary_url' },
    page_url: { type: GraphQLString, sqlColumn: 'page_url' },
    full_text_url: { type: GraphQLString, sqlColumn: 'full_text_url' },
    passed: { type: GraphQLBoolean, sqlColumn: 'passed' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' },
    events: {
      description: 'Events related this this bill',
      type: GraphQLList(EventType),
      sqlJoin: (billTable, eventTable, args) =>
        `${billTable}.code = ${eventTable}.bill_code`
    },
    categories: {
      description: 'Categories associated with this bill',
      type: new GraphQLList(CategoryType),
      junction: {
        sqlTable: 'bill_categories',
        sqlJoins: [
          (billTable, billCategoriesTable, args) =>
            `${billTable}.id = ${billCategoriesTable}.bill_id`,
          (billCategoriesTable, categoryTable, args) =>
            `${billCategoriesTable}.category_id = ${categoryTable}.id`
        ]
      }
    },
    users: {
      description: 'Users following this bill',
      type: new GraphQLList(UserType),
      junction: {
        sqlTable: 'user_bills',
        sqlJoins: [
          (billTable, userBillsTable, args) =>
            `${billTable}.id = ${userBillsTable}.bill_id`,
          (userBillsTable, userTable, args) =>
            `${userBillsTable}.user_id = ${userTable}.id`
        ]
      }
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
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    bill_code: {
      type: BillType,
      sqlJoin: (eventTable, billTable, args) =>
        `${eventTable}.bill_code = ${billTable}.code`
    },
    title: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'title' },
    publication_date: { type: DateScalar, sqlColumn: 'publication_date' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' }
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
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    name: { type: GraphQLString, sqlColumn: 'name' },
    uclassify_class: { type: GraphQLString, sqlColumn: 'uclassify_class' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' },
    users: {
      description: 'Users following this category',
      type: new GraphQLList(UserType),
      junction: {
        sqlTable: 'user_categories',
        sqlJoins: [
          (categoryTable, userCategoriesTable, args) =>
            `${categoryTable}.id = ${userCategoriesTable}.category_id`,
          (userCategoriesTable, userTable, args) =>
            `${userCategoriesTable}.user_id = ${userTable}.id`
        ]
      }
    },
    bills: {
      description: 'Bills associated with this category',
      type: new GraphQLList(BillType),
      junction: {
        sqlTable: 'bill_categories',
        sqlJoins: [
          (categoryTable, billCategoriesTable, args) =>
            `${categoryTable}.id = ${billCategoriesTable}.category_id`,
          (billCategoriesTable, billTable, args) =>
            `${billCategoriesTable}.bill_id = ${billTable}.id`
        ]
      }
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
    id: { type: GraphQLNonNull(GraphQLInt), sqlColumn: 'id' },
    first_name: {
      type: GraphQLNonNull(GraphQLString),
      sqlColumn: 'first_name'
    },
    last_name: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'last_name' },
    username: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'username' },
    password: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'password' },
    email: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'email' },
    phone_number: { type: GraphQLInt, sqlColumn: 'phone_number' },
    email_notification: {
      type: notificationEnumType,
      sqlColumn: 'email_notification'
    },
    sms_notification: {
      type: notificationEnumType,
      sqlColumn: 'sms_notification'
    },
    active: { type: GraphQLBoolean, sqlColumn: 'active' },
    created_at: { type: GraphQLDateTime, sqlColumn: 'created_at' },
    bills: {
      description: 'Bills followed by this user',
      type: new GraphQLList(BillType),
      junction: {
        sqlTable: 'user_bills',
        sqlJoins: [
          (userTable, userBillsTable, args) =>
            `${userTable}.id = ${userBillsTable}.user_id`,
          (userBillsTable, billTable, args) =>
            `${userBillsTable}.bill_id = ${billTable}.id`
        ]
      }
    },
    categories: {
      description: 'Categories followed by this user',
      type: new GraphQLList(CategoryType),
      junction: {
        sqlTable: 'user_categories',
        sqlJoins: [
          (userTable, userCategoriesTable, args) =>
            `${userTable}.id = ${userCategoriesTable}.user_id`,
          (userCategoriesTable, categoryTable, args) =>
            `${userCategoriesTable}.category_id = ${categoryTable}.id`
        ]
      }
    }
  })
});

UserType._typeConfig = {
  sqlTable: 'users',
  uniqueKey: 'id'
};

const BillCategoryType = new GraphQLObjectType({
  name: 'BillCategory',
  type: 'Query',
  fields: () => ({
    bill_id: { type: GraphQLNonNull(GraphQLString) },
    category_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime }
  })
});

BillCategoryType._typeConfig = {
  sqlTable: 'bill_categories'
};

const UserBillType = new GraphQLObjectType({
  name: 'UserBill',
  type: 'Query',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLString) },
    bill_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime }
  })
});

UserBillType._typeConfig = {
  sqlTable: 'user_bills'
};

const UserCategoryType = new GraphQLObjectType({
  name: 'UserCategory',
  type: 'Query',
  fields: () => ({
    user_id: { type: GraphQLNonNull(GraphQLString) },
    category_id: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLDateTime }
  })
});

UserCategoryType._typeConfig = {
  sqlTable: 'user_categories'
};

exports.ParliamentType = ParliamentType;
exports.ParliamentarySessionType = ParliamentarySessionType;
exports.BillType = BillType;
exports.EventType = EventType;
exports.CategoryType = CategoryType;
exports.UserType = UserType;
exports.BillCategoryType = BillCategoryType;
exports.UserBillType = UserBillType;
exports.UserCategoryType = UserCategoryType;
