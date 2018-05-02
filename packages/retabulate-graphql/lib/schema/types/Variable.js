'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _Aggregation = require('./Aggregation');

var _Aggregation2 = _interopRequireDefault(_Aggregation);

var _inputTypes = require('./inputTypes');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VariableType = new _graphql.GraphQLObjectType({
  name: 'VariableType',
  description: 'Designates a column used as a computational variable',
  fields: () => ({
    key: {
      description: 'Key (column in dataset)',
      type: _graphql.GraphQLString,
      resolve: ({ key }) => key
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
    label: {
      description: 'Label for this variable',
      type: _graphql.GraphQLString,
      resolve: ({ label }) => label
    },
    statistic: {
      description: 'Apply an aggregation method to this variable',
      type: _Aggregation2.default,
      args: {
        method: {
          description: 'Aggregation method (mean, sum, etc)',
          type: _graphql.GraphQLString
        },
        methods: {
          description: 'Multiple aggregation methods (list)',
          type: new _graphql.GraphQLList(_graphql.GraphQLString)
        },
        diff: {
          description: 'Define a substituted condition against which to compare',
          type: _inputTypes.ConditionType
        },
        over: {
          description: 'Designate column for denominator of percentages',
          type: _graphql.GraphQLString
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: _graphql.GraphQLString
        }
      },
      resolve: (data, { method, methods, diff, over, renderId }) => Object.assign({}, data, {
        _agg: method || methods,
        _over: over,
        _diff: diff,
        method,
        _renderIds: (0, _helpers.concat)(data._renderIds, renderId)
      })
    },
    value: {
      description: 'Filter column by a value or values',
      type: VariableType,
      args: {
        value: { type: _graphql.GraphQLString },
        values: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
        renderId: { type: _graphql.GraphQLString }
      },
      resolve: (data, { value, values, renderId }) => Object.assign({}, data, {
        _value: value !== undefined ? value : values,
        _renderIds: (0, _helpers.concat)(data._renderIds, renderId)
      })
    },
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: _graphql.GraphQLID,
      resolve: (data, args, context) => (0, _helpers.generateLeaf)(data, context)
    },
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: _Node2.default,
      resolve: data => data
    }
  })
});

exports.default = VariableType;