'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AggregationType = new _graphql.GraphQLObjectType({
  name: 'AggregationType',
  description: 'Defines statistical aggregations over a variable & grouping',
  fields: () => ({
    method: {
      description: 'The aggregation method',
      type: _graphql.GraphQLString,
      resolve: ({ method }) => method
    },
    methods: {
      description: 'Mutliple aggregation methods',
      type: new _graphql.GraphQLList(_graphql.GraphQLString),
      resolve: ({ methods }) => methods
    },
    renderId: {
      description: 'Unique id for use when coordinating rendering',
      type: _graphql.GraphQLString,
      resolve: ({ renderId }) => renderId
    },
    renderIds: {
      description: 'All renderIds traversed on this path',
      type: new _graphql.GraphQLList(_graphql.GraphQLString),
      resolve: ({ _renderIds }) => _renderIds
    },
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: _graphql.GraphQLID,
      resolve: (data, args, context) => (0, _helpers.generateLeaf)(data, context)
    },
    node: {
      description: 'final hierarchy level',
      type: _Node2.default,
      resolve: data => data
    }
  })
});

exports.default = AggregationType;