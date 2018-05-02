import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const QueryConditionType = new GraphQLObjectType({
  name: 'QueryConditionType',
  description: 'Filter condition on dataset columns',
  fields: {
    key: {
      description: 'The column in dataset',
      type: GraphQLString
    },
    values: {
      description: 'The accepted values',
      type: new GraphQLList(GraphQLString)
    },
  }
});

export default QueryConditionType;