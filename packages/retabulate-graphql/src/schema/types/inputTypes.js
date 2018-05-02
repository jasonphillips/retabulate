import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType
} from 'graphql';

export const ConditionType = new GraphQLInputObjectType({
  name: 'ConditionType',
  description: 'key, [values] pair to apply as a filtering condition',
  fields: {
    key: {
      description: 'The key (column)',
      type: GraphQLString
    },
    values: {
      description: 'List of accepted values',
      type: new GraphQLList(GraphQLString)
    },
  }
});

export const GroupMapType = new GraphQLInputObjectType({
  name: 'GroupMapType',
  description: 'key, [values] pair to apply as a filtering condition',
  fields: {
    label: {
      description: 'The key (column)',
      type: new GraphQLNonNull(GraphQLString)
    },
    values: {
      description: 'List of accepted values',
      type: new GraphQLList(GraphQLString)
    },
  }
});