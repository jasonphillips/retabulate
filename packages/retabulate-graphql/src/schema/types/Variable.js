import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import NodeType from './Node';
import AggregationType from './Aggregation';
import { ConditionType } from './inputTypes';

import {
  generateLeaf,
  concat,
} from '../helpers';

const VariableType = new GraphQLObjectType({
  name: 'VariableType',
  description: 'Designates a column used as a computational variable',
  fields: () => ({
    key: {
      description: 'Key (column in dataset)',
      type: GraphQLString,
      resolve: ({key}) => key,
    },
    renderId: {
      description: 'Unique id for use when coordinating rendering',
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      description: 'All renderIds traversed on this path',
      type: new GraphQLList(GraphQLString),
      resolve: ({_renderIds}) => _renderIds, 
    },
    label: {
      description: 'Label for this variable',
      type: GraphQLString,
      resolve: ({label}) => label,
    },
    statistic: {
      description: 'Apply an aggregation method to this variable',
      type: AggregationType,
      args: {
        method: { 
          description: 'Aggregation method (mean, sum, etc)',
          type: GraphQLString,
        },
        methods: { 
          description: 'Multiple aggregation methods (list)',
          type: new GraphQLList(GraphQLString),
        },
        diff: { 
          description: 'Define a substituted condition against which to compare',
          type: ConditionType,
        },
        over: {
          description: 'Designate column for denominator of percentages',
          type: GraphQLString,
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: GraphQLString,
        },
      },
      resolve: (data, {method, methods, diff, over, renderId}) => ({
        ...data, 
        _agg: method || methods, 
        _over: over, 
        _diff: diff, 
        method,
        _renderIds: concat(data._renderIds, renderId),
      }),
    },
    value: {
      description: 'Filter column by a value or values',
      type: VariableType,
      args: {
        value: { type: GraphQLString },
        values: { type: new GraphQLList(GraphQLString) },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {value, values, renderId}) => ({
        ...data,
        _value: value !== undefined ? value : values,
        _renderIds: concat(data._renderIds, renderId),
      }),
    },
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: NodeType,
      resolve: (data) => data,
    }
  })
});

export default VariableType;