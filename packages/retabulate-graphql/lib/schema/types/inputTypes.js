'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrderConditionType = exports.GroupMapType = exports.ConditionType = undefined;

var _graphql = require('graphql');

const ConditionType = exports.ConditionType = new _graphql.GraphQLInputObjectType({
  name: 'ConditionType',
  description: 'key, [values] pair to apply as a filtering condition',
  fields: {
    key: {
      description: 'The key (column)',
      type: _graphql.GraphQLString
    },
    values: {
      description: 'List of accepted values',
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    }
  }
});

const GroupMapType = exports.GroupMapType = new _graphql.GraphQLInputObjectType({
  name: 'GroupMapType',
  description: 'key, [values] pair to apply as a filtering condition',
  fields: {
    label: {
      description: 'The key (column)',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    values: {
      description: 'List of accepted values',
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    }
  }
});

const OrderConditionType = exports.OrderConditionType = new _graphql.GraphQLInputObjectType({
  name: 'OrderConditionType',
  description: 'column, statistic, and direction by which to order groups',
  fields: {
    column: {
      description: 'the data column',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    method: {
      description: 'the statistical method',
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    descending: {
      description: 'if true, sort descending instead of ascending',
      type: _graphql.GraphQLBoolean
    }
  }
});