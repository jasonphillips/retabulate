import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import CellType from './Cell';
import { omit } from '../helpers';

const RowType = new GraphQLObjectType({
  name: 'RowType',
  description: 'Represents a row of cells in the data portion of table',
  fields: {
    length: {
      description: 'Number of cells in this row',
      type: GraphQLInt,
      resolve: ({_grid}) => _grid.x.length,
    },
    cells: {
      description: 'Ordered cells in row with data',
      type: new GraphQLList(CellType),
      resolve: (y, args) => y._grid.x.map(x => {
        const detransposes = {...x.detransposes, ...y.detransposes};
        const variable = y.variable || x.variable || null;
        const value = y.value || x.value || null;
  
        let query = {...y.query, ...x.query};
        let diffDetransposes;
        let diffRows;
        let diffOver;
  
        if (variable && value!==null) {
          query = {...query, [detransposes[variable] || variable]: value};
        }
  
        const agg = y.agg || x.agg || 'n';
        const over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
        const overQuery = over ? omit(query, [over]) : null;
  
        const rows = y._rows.filterAny(query);
  
        if (y.diff || x.diff) {
          const diff = x.diff || y.diff;

          if (detransposes[diff.key]) {
            diffDetransposes = {...detransposes, [diff.key]: diff.values[0]};
            diffRows = rows;
          } else {
            diffRows = y._all.filterAny(omit(query, [diff.key]));
            diffOver = y._all.filterAny(omit(query, [diff.key, over]));
    
            if (diff.values) {
              diffRows = diffRows.filterAny({[diff.key]: diff.values});
              diffOver = diffOver.filterAny({[diff.key]: diff.values});
            }
          }
        }
        
        return {
          query: query,
          variable,
          agg: agg,
          detransposes: detransposes,
          diffDetransposes: diffDetransposes ? diffDetransposes : detransposes,
          colID: x.id,
          rowID: y.id,
          rows: rows.data,
          over: over ? y._all.filterAny(overQuery).data : null,
          diff: diffRows ? diffRows.data : null,
          diffOver: diffOver ? diffOver.data : null,
          fmt: y.fmt || x.fmt || '',
          renderIds: x.renderIds.concat(y.renderIds),
        }
      }),
    }
  }
});

export default RowType;