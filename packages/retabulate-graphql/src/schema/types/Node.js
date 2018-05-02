import {
  GraphQLObjectType,
  GraphQLID,
} from 'graphql';

import { generateLeaf } from '../helpers';

const NodeType = new GraphQLObjectType({
  name: 'NodeType',
  description: 'Generic type for a repeated hierarchy level',
  fields: () => ({
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: NodeType,
      resolve: (data) => data,
    },
  })
});

export default NodeType;