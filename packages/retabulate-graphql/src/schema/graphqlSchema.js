import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType
} from 'graphql';

import {
  CollectionMap,
  generateLeaf,
  concat,
  applyAggregations,
} from './helpers';

import _ from 'lodash';

const ConditionType = new GraphQLInputObjectType({
  name: 'ConditionType',
  fields: {
    key: {
      type: GraphQLString
    },
    values: {
      type: new GraphQLList(GraphQLString)
    }
  }
});

const QueryConditionType = new GraphQLObjectType({
  name: 'QueryConditionType',
  fields: {
    key: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    },
  }
});

const GroupMapType = new GraphQLInputObjectType({
  name: 'GroupMapType',
  fields: {
    label: {
      type: new GraphQLNonNull(GraphQLString)
    },
    values: {
      type: new GraphQLList(GraphQLString)
    }
  }
});

const NodeType = new GraphQLObjectType({
  name: 'NodeType',
  fields: () => ({
    leaf: {
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      type: NodeType,
      resolve: (data) => data,
    }
  })
});

const AggregationType = new GraphQLObjectType({
  name: 'AggregationType',
  fields: () => ({
    method: {
      type: GraphQLString,
      resolve: ({method}) => method,
    },
    methods: {
      type: new GraphQLList(GraphQLString),
      resolve: ({methods}) => methods,
    },
    renderId: {
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({_renderIds}) => _renderIds, 
    },
    leaf: {
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      type: NodeType,
      resolve: (data) => data,
    }
  })
});

const VariableType = new GraphQLObjectType({
  name: 'VariableType',
  fields: () => ({
    key: {
      type: GraphQLString,
      resolve: ({key}) => key,
    },
    keys: {
      type: new GraphQLList(GraphQLString),
      resolve: ({keys}) => keys,
    },
    renderId: {
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({_renderIds}) => _renderIds, 
    },
    label: {
      type: GraphQLString,
      resolve: ({label}) => label,
    },
    statistic: {
      type: AggregationType,
      args: {
        method: { type: GraphQLString },
        methods: { type: new GraphQLList(GraphQLString) },
        diff: { type: ConditionType },
        format: { type: GraphQLString },
        over: { type: GraphQLString },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {method, methods, diff, over, renderId}) => ({
        ...data, _agg: method || methods, _over: over, _diff: diff, method, _renderIds: concat(data._renderIds, renderId)
      }),
    },
    value: {
      type: VariableType,
      args: {
        value: { type: GraphQLString },
        values: { type: new GraphQLList(GraphQLString) },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {value, values, renderId}) => ({
        ...data, _value: value || values, _renderIds: concat(data._renderIds, renderId)
      }),
    },
    all: {
      type: VariableType,
      args: {
        label: { type: GraphQLString },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {label, renderId}) => ({
        ...data, 
        renderId,
        label,
        _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1,
      }),
    },
    leaf: {
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    node: {
      type: NodeType,
      resolve: (data) => data,
    }
  })
});

const AxisType = new GraphQLObjectType({
  name: 'AxisType',
  fields: () => ({
    label: {
      type: GraphQLString,
      resolve: ({key}) => key,
    },
    length: {
      type: GraphQLInt,
      resolve: ({_rows}) => _rows.length,
    },
    leaf: {
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
    },
    renderId: {
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({_renderIds}) => _renderIds, 
    },
    node: {
      type: AxisType,
      resolve: (data) => data,
    },
    all: {
      type: AxisType,
      args: {
        label: { type: GraphQLString },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {label, renderId}) => ({
        ...data, 
        label, key:label, 
        renderId, _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1,
      }),
    },
    variable: {
      type: VariableType,
      args: {
        key: { type: GraphQLString },
        keys: { type: new GraphQLList(GraphQLString) },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {key, keys, renderId}) => ({
        ...data, _variable: keys || key, key, _renderIds: concat(data._renderIds, renderId
      )}),
    },
    transpose: {
      type: new GraphQLList(AxisType),
      args: {
        keys: { type: new GraphQLList(GraphQLString) },
        asKey: { type: GraphQLString },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {keys, asKey, renderId}) => {
        data._aggIndex++;
  
        return keys.map(inKey => ({
          ...data, 
          key: inKey,
          _rows:data._rows,
          _transposes:{...data._transposes, [inKey]:asKey},
          _detransposes: {...data._detransposes, [asKey]:inKey},
          _renderIds: concat(data._renderIds, renderId),
          renderId
        }));
      },
    },
    classes: {
      type: new GraphQLList(AxisType),
      args: {
        key: { type: GraphQLString },
        all: { type: GraphQLString },
        total: { type: GraphQLString },
        orderBy: { type: GraphQLString },
        renderId: { type: GraphQLString },
        mapping: { type: new GraphQLList(GroupMapType) },
        ordering: { type: new GraphQLList(GraphQLString) },
      },
      resolve: (data, {key, all, total, orderBy, renderId, mapping, ordering}) => {
        data._aggIndex++;
        // total never groups again, just descends
        if (data._isTotal) {
          return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
        }
  
        const dataKey = data._detransposes[key] || key;
        //const groups = groupBy(data._rows, dataKey);
        const groups = data._rows.descend(dataKey);
        let value;
  
        if (mapping) {
          // build list of possible values, to track umapped / remainder
          const allGroups = groups.keys().reduce((all,k) => ({...all, [k]:true}), {});
          // iterate over mappings
          value = mapping.map(({label, values}) => {
  
            const basics = {
              ...data,
              key: label,
              _aggIndex: data._aggIndex,
              _renderIds: concat(data._renderIds, renderId),
              renderId
            };
  
            if (values) {
              const rows = groups.keys(values);
              for (let val of values) allGroups[val] = false;
  
              return {
                ...basics, 
                _rows: rows, 
                _query: {...data._query, [dataKey]: values}
              };
            } 
  
            // if no values, assume "group all remaining"
            const remainingValues = Object.keys(allGroups).filter(k => allGroups[k]);
            const coveredValues = Object.keys(allGroups).filter(k => !allGroups[k]);
  
            return {
              ...basics, 
              _rows: remainingValues ? remainingValues.reduce((all,v) => all.concat(groups[v]), []): [],
              _query: {...data._query, [dataKey]: remainingValues}
            };
          });
  
        } else {
          // no explicit mapping passed, group all, unless 'ordering' list passed
          const valuesSet = ordering ? ordering : groups.keys();
  
          value = valuesSet.map((groupValue) => ({
            ...data,
            key: groupValue,
            _rows: groups.keys(groupValue),
            _aggIndex: data._aggIndex,
            _query: {...data._query, [dataKey]:groupValue},
            _renderIds: concat(data._renderIds, renderId),
            renderId
          }))
        }
  
        // apply optional ordering by another column
        if (orderBy) value = _.sortBy(value, (v) => v._rows.data[0][orderBy]);
  
        // add in the total group if all / total requested
        if (all || total) value.push(
          {...data, key:all, _aggIndex:data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId}
        )
  
        return value;
      },
    },
  })
});

const CellType = new GraphQLObjectType({
  name: 'CellType',
  fields: {
    agg: {
      type: GraphQLString,
      agg: ({agg}) => agg,
    },
    variable: {
      type: GraphQLString,
      agg: ({variable}) => variable,
    },
    renderId: {
      type: GraphQLString,
      resolve: ({renderId}) => renderId, 
    },
    renderIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({renderIds}) => renderIds, 
    },
    rowID: {
      type: GraphQLID,
      resolve: ({rowID}) => rowID,
    },
    colID: {
      type: GraphQLID,
      resolve: ({colID}) => colID,
    },
    value: {
      type: GraphQLString,
      args: {
        missing: { type: GraphQLString },
      },
      resolve: ({query, detransposes, diffDetransposes, variable, agg, diff, diffOver, over, rows, fmt}, {missing}) => {
        return JSON.stringify(diff
          // if diff: calculate this group, diff group
          ? {
              group: applyAggregations(agg)(rows, detransposes[variable] || variable, over),
              diff: applyAggregations(agg)(diff, diffDetransposes[variable] || variable, diffOver)
            }
          : applyAggregations(agg)(rows, detransposes[variable] || variable, over)
        );
      },
    },
    queries: {
      type: new GraphQLList(QueryConditionType),
      resolve: ({query}) => _.map(_.keys(query), (key) => ({key, value: query[key]})),
    }
  }
});

const RowType = new GraphQLObjectType({
  name: 'RowType',
  fields: {
    length: {
      type: GraphQLInt,
      resolve: ({_grid}) => _grid.x.length,
    },
    cells: {
      type: new GraphQLList(CellType),
      resolve: (y, args) => _.map(y._grid.x, (x) => {
        const detransposes = {...x.detransposes, ...y.detransposes};
        const variable = y.variable || x.variable || null;//detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null;
        const value = y.value || x.value || null;
  
        let query = {...y.query, ...x.query};
        let diffDetransposes;
        let diffRows;
        let diffOver;
  
        if (variable && value!==null) {
          query = {...query, [variable]: value};
        }
  
        const agg = y.agg || x.agg || 'n';
        const over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
        const overQuery = over ? _.omit(query, over) : null;
  
        const rows = y._rows.filterAny(query);
  
        if (y.diff || x.diff) {
          const diff = x.diff || y.diff;

          if (detransposes[diff.key]) {
            diffDetransposes = {...detransposes, [diff.key]: diff.values[0]};
            diffRows = rows;
          } else {
            diffRows = y._all.filterAny(_.omit(query, diff.key));
            diffOver = y._all.filterAny(_.omit(query, [diff.key, over]));
    
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
        (resolve, rej) => process.nextTick(() => {
          resolve(
            _.map(_.sortBy(_grid.y, 'id'), (y) => ({
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

/*
  For inclusion in other schemas
*/
export const tableField = {
  type: TableType,
  args: {
    set: { type: GraphQLString },
    where: { type: new GraphQLList(ConditionType) },
  },
  resolve: (root, {set, where}, context) => new Promise((resolve, reject) => {
      context.getDataset(set).then((data) => {

      if (!data) {
        throw new Error(`dataset ${set} not found`);
      }

      let collection = new CollectionMap(data);
      context.tabulate = {iterator: 0};

      if (where) collection = collection.filterAny(
        where.reduce((all, {key, values}) => ({...all, [key]: values}), {})
      );

      resolve({
        _rows: collection, 
        _query:{}, _grid:{}, _renderIds:[], _transposes:{}, _detransposes:{}, _exclude:{}, _aggIndex:0});
      });
  })
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