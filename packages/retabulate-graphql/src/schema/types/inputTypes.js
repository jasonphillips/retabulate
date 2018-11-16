import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLBoolean
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

export const OrderConditionType = new GraphQLInputObjectType({
  name: 'OrderConditionType',
  description: 'column, statistic, and direction by which to order groups',
  fields: {
    column: {
      description: 'the data column',
      type: new GraphQLNonNull(GraphQLString)
    },
    method: {
      description: 'the statistical method',
      type: new GraphQLNonNull(GraphQLString)
    },
    descending: {
      description: 'if true, sort descending instead of ascending',
      type: GraphQLBoolean
    }
  }
});