const { GraphQLScalarType } = require('graphql');
const moment = require('moment');

const dateOrUndefinedSerialize = (value) => {
  const formattedDate = moment(value, 'YYYY-MM-DD');
  if ((formattedDate.isValid(), true)) {
    return formattedDate;
  } else if (value === 'undefined') {
    return undefined;
  } else {
    throw new Error('Date scalar must be a valid date string or undefined.');
  }
};

const dateOrUndefinedParseValue = (value) => {
  const formattedDate = moment(value, 'YYYY-MM-DD');
  if ((formattedDate.isValid(), true)) {
    return formattedDate;
  } else if (value === 'undefined') {
    return undefined;
  } else {
    throw new Error('Date scalar must be a valid date string or undefined.');
  }
};

const dateOrUndefinedParseLiteral = (ast) => {
  const formattedDate = moment(ast.value, 'YYYY-MM-DD');
  if ((formattedDate.isValid(), true)) {
    return formattedDate;
  } else if (ast.value === 'undefined') {
    return undefined;
  } else {
    throw new Error('Date scalar must be a valid date string or undefined.');
  }
};

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'A Date string or undefined',
  serialize: dateOrUndefinedSerialize,
  parseValue: dateOrUndefinedParseValue,
  parseLiteral: dateOrUndefinedParseLiteral
});

exports.DateScalar = DateScalar;
