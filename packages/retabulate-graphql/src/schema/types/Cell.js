import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,  
  GraphQLBoolean,
} from 'graphql';

import QueryConditionType from './QueryCondition';
import { applyAggregations } from '../helpers';

const CellType = new GraphQLObjectType({
  name: 'CellType',
  description: 'Represents a cell and its data',
  fields: {
    agg: {
      description: 'The aggregation method in this cell',
      type: GraphQLString,
      resolve: ({agg}) => (agg && agg.join) ? agg.join(',') : agg,
    },
    variable: {
      description: 'The variable (column) in this cell',
      type: GraphQLString,
      resolve: ({variable}) => variable,
    },
    detransposed: {
      description: 'If column is transposed, the original column',
      type: GraphQLString,
      resolve: ({detransposes, variable}) => detransposes ? detransposes[variable] : null,
    },
    renderId: {
      description: 'Rendering ID',
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      description: 'Rendering IDs traversed in path to this cell',
      type: new GraphQLList(GraphQLString),
      resolve: ({renderIds}) => renderIds, 
    },
    rowID: {
      description: 'ID of the row',
      type: GraphQLID,
      resolve: ({rowID}) => rowID,
    },
    colID: {
      description: 'Id of the column',
      type: GraphQLID,
      resolve: ({colID}) => colID,
    },
    redacted: {
      description: 'Data is redacted (below a minimum)',
      type: GraphQLBoolean,
      resolve: ({redacted}) => redacted,
    },
    value: {
      description: 'Value (stringified data)',
      type: GraphQLString,
      resolve: ({query, detransposes, diffDetransposes, variable, agg, diff, diffOver, over, rows, fmt}) => {
        return JSON.stringify(
          // if diff: calculate this group, diff group
          diff
            ? {
                group: applyAggregations(agg)(rows, detransposes[variable] || variable, over),
                diff: applyAggregations(agg)(diff, diffDetransposes[variable] || variable, diffOver)
              }
            : applyAggregations(agg)(rows, detransposes[variable] || variable, over)
        );
      },
    },
    queries: {
      description: 'Queries that sliced the records referenced by this cell',
      type: new GraphQLList(QueryConditionType),
      resolve: ({query}) => Object.keys(query).map(key => ({
        key, 
        values: typeof(query[key])!=='object' ? [query[key]] : query[key],
      })),
    }
  }
});

export default CellType;