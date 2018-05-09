import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import TableType from './types/Table';
import { ConditionType } from './types/inputTypes';
import { CollectionMap } from './helpers';

/*
  A field for including / stitching to other schemas
*/

export const tableField = {
  type: TableType,
  args: {
    set: { type: GraphQLString },
    queryId: { type: GraphQLString },
    where: { type: new GraphQLList(ConditionType) },
  },
  resolve: (root, { set, where, queryId }, context) => {
    // get the dataset and begin
    return new Promise((resolve, reject) => context.getDataset(set, queryId).then((data) => {
      if (!data) {
        throw new Error(`dataset ${set} not found`);
      }

      let collection = new CollectionMap(data);
      context.tabulate = { iterator: 0 };

      if (where) collection = collection.filterAny(
        where.reduce((all, {key, values}) => ({...all, [key]: values}), {})
      );

      resolve({
        _rows: collection, 
        _query:{},
        _grid:{},
        _renderIds:[],
        _transposes:{},
        _detransposes:{},
        _exclude:{},
        _aggIndex:0,
      });
    }));
  }
}

export const RootType = new GraphQLObjectType({
  name: 'RootType',
  fields: {
    table: tableField
  }
});

const schema = new GraphQLSchema({
  query: RootType
});
  
export default schema;