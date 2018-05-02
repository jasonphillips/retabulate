import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import VariableType from './Variable';
import { GroupMapType } from './inputTypes';

import {
  generateLeaf,
  concat,
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
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: GraphQLString,
        },
      },
      resolve: (data, {keys, asKey, renderId}) => {
        data._aggIndex++;
  
        return keys.map(inKey => ({
          ...data, 
          key: inKey,
          _rows:data._rows,
          _transposes: { ...data._transposes, [inKey]: asKey },
          _detransposes: { ...data._detransposes, [asKey]: inKey },
          _renderIds: concat(data._renderIds, renderId),
          renderId
        }));
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
      },
      resolve: (data, {key, all, total, orderBy, renderId, mapping, ordering}) => {
        data._aggIndex++;

        // a 'total' never groups again, just descends
        if (data._isTotal) {
          return [{...data, key: '_', _aggIndex:data._aggIndex, _isTotal: true}];
        }
  
        // resolve any transposition first
        const dataKey = data._detransposes[key] || key;

        const groups = data._rows.descend(dataKey);
        let value;
  
        if (mapping) {
          // build list of possible values, to track umapped / remainder
          const allGroups = groups.keys().reduce((all, k) => ({...all, [k]:true}), {});

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
            _query: { ...data._query, [dataKey]:groupValue },
            _renderIds: concat(data._renderIds, renderId),
            renderId
          }))
        }
  
        // apply optional ordering by another column
        if (orderBy) value.sort(
          (a,b) => a._rows.data[0][orderBy] > b._rows.data[0][orderBy]
            ? 1
            : -1
        )
  
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
  
        return value;
      },
    },
  })
});

export default AxisType;