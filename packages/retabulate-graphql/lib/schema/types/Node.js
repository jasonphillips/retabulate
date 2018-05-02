'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _helpers = require('../helpers');

const NodeType = new _graphql.GraphQLObjectType({
  name: 'NodeType',
  description: 'Generic type for a repeated hierarchy level',
  fields: () => ({
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: _graphql.GraphQLID,
      resolve: (data, args, context) => (0, _helpers.generateLeaf)(data, context)
    },
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: NodeType,
      resolve: data => data
    }
  })
});

exports.default = NodeType;