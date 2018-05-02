'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

const QueryConditionType = new _graphql.GraphQLObjectType({
  name: 'QueryConditionType',
  description: 'Filter condition on dataset columns',
  fields: {
    key: {
      description: 'The column in dataset',
      type: _graphql.GraphQLString
    },
    values: {
      description: 'The accepted values',
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    }
  }
});

exports.default = QueryConditionType;