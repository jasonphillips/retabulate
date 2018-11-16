import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import VariableType from './Variable';
import { GroupMapType, OrderConditionType } from './inputTypes';

import {
  generateLeaf,
  concat,
  applyAggregations,
} from '../helpers';

const AxisType = new GraphQLObjectType({
  name: 'AxisType',
  description: 'A slice of the dataset along a set of conditions',
  fields: () => ({
    label: {
      description: 'Label for this grouping',
      type: GraphQLString,
      resolve: ({key}) => key,
    },
    length: {
      description: 'Number of records contained in this slice',
      type: GraphQLInt,
      resolve: ({_rows}) => _rows.length,
    },
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: GraphQLID,
      resolve: (data, args, context) => generateLeaf(data, context),
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
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: AxisType,
      resolve: (data) => data,
    },
    all: {
      description: 'Returns self with new label, renderId',
      type: AxisType,
      args: {
        label: { type: GraphQLString },
        renderId: { type: GraphQLString },
      },
      resolve: (data, {label, renderId}) => ({
        ...data, 
        label, 
        key:label, 
        renderId, 
        _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1,
      }),
    },
    variable: {
      description: 'Selects a column as a variable for aggregations',
      type: VariableType,
      args: {
        key: {
          description: 'Key (column in dataset)',
          type: GraphQLString,
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: GraphQLString
        },
      },
      resolve: (data, {key, keys, renderId}) => ({
        ...data,
        _variable: keys || key,
        key,
        _renderIds: concat(data._renderIds, renderId),
      }),
    },
    transpose: {
      description: 'Alias a set of columns as one variable on the other axis',
      type: new GraphQLList(AxisType),
      args: {
        keys: {
          description: 'Keys (columns) to split out and alias',
          type: new GraphQLList(GraphQLString),
        },
        asKey: {
          description: 'Target key name as new variable',
          type: GraphQLString,
        },
        orderByStatistic: {
          description: 'Order by statistic applied to each grouping',
          type: OrderConditionType
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: GraphQLString,
        },
      },
      resolve: (data, {keys, asKey, renderId, orderByStatistic}) => {
        data._aggIndex++;
  
        let values = keys.map(inKey => ({
          ...data, 
          key: inKey,
          _rows:data._rows,
          _transposes: { ...data._transposes, [inKey]: asKey },
          _detransposes: { ...data._detransposes, [asKey]: inKey },
          _renderIds: concat(data._renderIds, renderId),
          renderId
        }));

        // apply ordering by a statistic
        if (orderByStatistic) {
          const { method, column, descending } = orderByStatistic;
          
          values = values.sort((a,b) => {
            // if statistic is on the new key, detranspose each group
            const col = column===asKey
              ? group => group.key
              : group => column

            return (
              applyAggregations(method)(a._rows.data, col(a)) >
              applyAggregations(method)(b._rows.data, col(b))
                ? descending ? -1 : 1
                : descending ? 1 : -1
            )
          })
        }

        return values;
      },
    },
    classes: {
      description: 'Group & split data by a column',
      type: new GraphQLList(AxisType),
      args: {
        key: {
          description: 'Key (column) in dataset',
          type: GraphQLString,
        },
        all: {
          description: 'Alias for total',
          type: GraphQLString,
        },
        total: {
          description: 'Include entry for total with this label',
          type: GraphQLString,
        },
        orderBy: {
          description: 'Order by values of another column',
          type: GraphQLString,
        },
        orderByStatistic: {
          description: 'Order by statistic applied to each grouping',
          type: OrderConditionType
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: GraphQLString,
        },
        mapping: {
          description: 'Explicit mapping of labels to values',
          type: new GraphQLList(GroupMapType),
        },
        ordering: {
          description: 'Explicit ordering of values',
          type: new GraphQLList(GraphQLString),
        },
        delimiter: {
          description: 'Treat as multiple values using this delimiter',
          type: GraphQLString,
        }
      },
      resolve: (data, {
        key, 
        all, 
        total, 
        orderBy, 
        orderByStatistic,
        renderId, 
        mapping, 
        ordering, 
        delimiter,
      }, context) => {
        data._aggIndex++;
        const options = context.retabulateOptions || {};
        const { minimum, showRedacted } = options;

        // a 'total' never groups again, just descends
        if (data._isTotal) {
          return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
        }
  
        // resolve any transposition first
        const dataKey = data._detransposes[key] || key;

        const groups = data._rows.descend(dataKey, delimiter ? { delimiter } : null);
        let value = [];
  
        if (mapping) {
          // build list of possible values, to track umapped keys left over
          const allGroups = groups.keys().reduce((all, k) => ({...all, [k]:true}), {});

          mapping.forEach(({label, values}) => {
            const basics = {
              ...data,
              key: label,
              _aggIndex: data._aggIndex,
              _renderIds: concat(data._renderIds, renderId),
              renderId
            };
  
            if (values) {
              const rows = groups.keys(values);
              
              // drop this one from the remaining 'all' grouping
              for (let val of values) allGroups[val] = false;

              // if minimum provide, ensure group passes it
              if (minimum && rows.length < minimum) {
                // if showRedacted, pass empty set but flag as redacted
                if (showRedacted) return value.push({
                  ...basics, 
                  _rows: [], 
                  _redacted: true,
                  _query: {...data._query, [dataKey]: values}
                });
                return;
              }
  
              return value.push({
                ...basics, 
                _rows: rows, 
                _redacted: false, 
                _query: {...data._query, [dataKey]: values}
              });
            } 
  
            // if no values provided with label, assume "group all remaining"
            const remainingValues = Object.keys(allGroups).filter(k => allGroups[k]);
            const coveredValues = Object.keys(allGroups).filter(k => !allGroups[k]);
  
            value.push({
              ...basics, 
              _redacted: false, 
              _rows: remainingValues ? remainingValues.reduce((all,v) => all.concat(groups[v]), []): [],
              _query: {...data._query, [dataKey]: remainingValues}
            });
          });
        } else {
          // no explicit mapping passed: group all, unless 'ordering' list passed
          const valuesSet = ordering ? ordering : groups.keys();

          valuesSet.forEach((groupValue) => {
            const rows = groups.keys(groupValue);

            // check minimum threshold if setting provided
            if (minimum && rows.length < minimum) {
              if (showRedacted) value.push({
                ...data,
                key: groupValue,
                _rows: [],
                _redacted: true,
                _aggIndex: data._aggIndex,
                _query: { ...data._query, [dataKey]: groupValue },
                _renderIds: concat(data._renderIds, renderId),
                renderId
              })
              return;
            }

            value.push({
              ...data,
              key: groupValue,
              _rows: rows,
              _redacted: false,
              _aggIndex: data._aggIndex,
              _query: { ...data._query, [dataKey]: groupValue },
              _renderIds: concat(data._renderIds, renderId),
              renderId
            })
          })
        }
  
        // apply optional ordering by another column
        if (orderBy) {
          value.sort((orderBy==='_ASC' || orderBy==='_DESC')
            // special case: _ASC / _DESC based on row count
            ? (a,b) => a._rows.length > b._rows.length
              ? orderBy==='_ASC' ? 1 : -1
              : orderBy==='_ASC' ? -1 : 1
            : (a,b) => a._rows.data[0][orderBy] > b._rows.data[0][orderBy]
                ? 1
                : -1
          )
        }

        // apply ordering by a statistic
        if (orderByStatistic) {
          const { method, column, descending } = orderByStatistic;
          
          value.sort((a,b) =>
            applyAggregations(method)(a._rows.data, column) >
            applyAggregations(method)(b._rows.data, column)
              ? descending ? -1 : 1
              : descending ? 1 : -1
          )
        }
  
        // add in the total group if all / total requested
        if (all || total) value.push(
          {
            ...data,
            key: all, 
            _aggIndex: data._aggIndex, 
            renderIds: concat(data._renderIds, renderId), 
            renderId
          }
        )

        // if no groupings have resulted due to exclusions, include empty group
        if (value.length === 0) {
          value.push({
            ...data,
            _rows: [],
            key: '(none)',
            _redacted: true,
            _aggIndex: data._aggIndex, 
            renderIds: concat(data._renderIds, renderId), 
            renderId
          })
        }
  
        return value;
      },
    },
  })
});

export default AxisType;