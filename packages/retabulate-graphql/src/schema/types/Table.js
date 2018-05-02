import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import AxisType from './Axis';
import RowType from './Row';

const TableType = new GraphQLObjectType({
  name: 'TableType',
  fields: {
    top: {
      type: AxisType,
      resolve: (data, args) => ({...data, key:null, _axis:'x'}),
    },
    left: {
      type: AxisType,
      resolve: (data, args) => ({...data, key:null, _axis:'y'}),
    },
    length: {
      type: GraphQLInt,
      resolve: ({_rows}) => _rows.length,
    },
    rows: {
      type: new GraphQLList(RowType),
      resolve: ({_rows, _grid}) => new Promise(
        // the nextTick() hack is used to ensure Left / Right
        // axes have been processed prior to this execution
        (resolve, rej) => process.nextTick(() => {
          resolve(
           _grid.y.sort((a,b) => a.id > b.id ? 1 : -1).map(y => ({
              ...y,
              _grid,
              _rows: _rows,
              _all: _rows
            }))
          )
        })
      ),
    }
  }
});

export default TableType;