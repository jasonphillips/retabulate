'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _QueryCondition = require('./QueryCondition');

var _QueryCondition2 = _interopRequireDefault(_QueryCondition);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CellType = new _graphql.GraphQLObjectType({
  name: 'CellType',
  description: 'Represents a cell and its data',
  fields: {
    agg: {
      description: 'The aggregation method in this cell',
      type: _graphql.GraphQLString,
      resolve: ({ agg }) => agg && agg.join ? agg.join(',') : agg
    },
    variable: {
      description: 'The variable (column) in this cell',
      type: _graphql.GraphQLString,
      resolve: ({ variable }) => variable
    },
    detransposed: {
      description: 'If column is transposed, the original column',
      type: _graphql.GraphQLString,
      resolve: ({ detransposes, variable }) => detransposes ? detransposes[variable] : null
    },
    renderId: {
      description: 'Rendering ID',
      type: _graphql.GraphQLString,
      resolve: ({ renderId }) => renderId
    },
    renderIds: {
      description: 'Rendering IDs traversed in path to this cell',
      type: new _graphql.GraphQLList(_graphql.GraphQLString),
      resolve: ({ renderIds }) => renderIds
    },
    rowID: {
      description: 'ID of the row',
      type: _graphql.GraphQLID,
      resolve: ({ rowID }) => rowID
    },
    colID: {
      description: 'Id of the column',
      type: _graphql.GraphQLID,
      resolve: ({ colID }) => colID
    },
    redacted: {
      description: 'Data is redacted (below a minimum)',
      type: _graphql.GraphQLBoolean,
      resolve: ({ redacted }) => redacted
    },
    value: {
      description: 'Value (stringified data)',
      type: _graphql.GraphQLString,
      resolve: ({ query, detransposes, diffDetransposes, variable, agg, diff, diffOver, over, rows, fmt }) => {
        return JSON.stringify(
        // if diff: calculate this group, diff group
        diff ? {
          group: (0, _helpers.applyAggregations)(agg)(rows, detransposes[variable] || variable, over),
          diff: (0, _helpers.applyAggregations)(agg)(diff, diffDetransposes[variable] || variable, diffOver)
        } : (0, _helpers.applyAggregations)(agg)(rows, detransposes[variable] || variable, over));
      }
    },
    queries: {
      description: 'Queries that sliced the records referenced by this cell',
      type: new _graphql.GraphQLList(_QueryCondition2.default),
      resolve: ({ query }) => Object.keys(query).map(key => ({
        key,
        values: typeof query[key] !== 'object' ? [query[key]] : query[key]
      }))
    }
  }
});

exports.default = CellType;