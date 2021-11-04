const { GraphQLScalarType, Kind, ValueNode } = require("graphql");

const {
  DateScalar,
  TimeScalar,
  DateTimeScalar,
} = require("graphql-date-scalars");

module.exports = {
  DateTime: DateTimeScalar,
  Date: DateScalar,
  Time: TimeScalar,
};
