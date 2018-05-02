'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupMapType = exports.ConditionType = undefined;

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