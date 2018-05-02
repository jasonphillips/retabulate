import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import NodeType from './Node';
import { generateLeaf } from '../helpers';

const AggregationType = new GraphQLObjectType({
  name: 'AggregationType',
  description: 'Defines statistical aggregations over a variable & grouping',
  fields: () => ({
    method: {
      description: 'The aggregation method',
      type: GraphQLString,
      resolve: ({method}) => method,
    },
    methods: {
      description: 'Mutliple aggregation methods',
      type: new GraphQLList(GraphQLString),
      resolve: ({methods}) => methods,
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
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      description: 'final hierarchy level',
      type: NodeType,
      resolve: (data) => data,
    }
  })
});

export default AggregationType;