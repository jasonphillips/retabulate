'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Variable = require('./Variable');

var _Variable2 = _interopRequireDefault(_Variable);

var _inputTypes = require('./inputTypes');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AxisType = new _graphql.GraphQLObjectType({
  name: 'AxisType',
  description: 'A slice of the dataset along a set of conditions',
  fields: () => ({
    label: {
      description: 'Label for this grouping',
      type: _graphql.GraphQLString,
      resolve: ({ key }) => key
    },
    length: {
      description: 'Number of records contained in this slice',
      type: _graphql.GraphQLInt,
      resolve: ({ _rows }) => _rows.length
    },
    leaf: {
      description: 'Endpoint ID of a terminal path',
      type: _graphql.GraphQLID,
      resolve: (data, args, context) => (0, _helpers.generateLeaf)(data, context)
    },
    renderId: {
      description: 'Unique id for use when coordinating rendering',
      type: _graphql.GraphQLString,
      resolve: ({ renderId }) => renderId
    },
    renderIds: {
      description: 'All renderIds traversed on this path',
      type: new _graphql.GraphQLList(_graphql.GraphQLString),
      resolve: ({ _renderIds }) => _renderIds
    },
    node: {
      description: 'Returns self, used to add a hierarchy level',
      type: AxisType,
      resolve: data => data
    },
    all: {
      description: 'Returns self with new label, renderId',
      type: AxisType,
      args: {
        label: { type: _graphql.GraphQLString },
        renderId: { type: _graphql.GraphQLString }
      },
      resolve: (data, { label, renderId }) => Object.assign({}, data, {
        label,
        key: label,
        renderId,
        _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      })
    },
    variable: {
      description: 'Selects a column as a variable for aggregations',
      type: _Variable2.default,
      args: {
        key: {
          description: 'Key (column in dataset)',
          type: _graphql.GraphQLString
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: _graphql.GraphQLString
        }
      },
      resolve: (data, { key, keys, renderId }) => Object.assign({}, data, {
        _variable: keys || key,
        key,
        _renderIds: (0, _helpers.concat)(data._renderIds, renderId)
      })
    },
    transpose: {
      description: 'Alias a set of columns as one variable on the other axis',
      type: new _graphql.GraphQLList(AxisType),
      args: {
        keys: {
          description: 'Keys (columns) to split out and alias',
          type: new _graphql.GraphQLList(_graphql.GraphQLString)
        },
        asKey: {
          description: 'Target key name as new variable',
          type: _graphql.GraphQLString
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: _graphql.GraphQLString
        }
      },
      resolve: (data, { keys, asKey, renderId }) => {
        data._aggIndex++;

        return keys.map(inKey => Object.assign({}, data, {
          key: inKey,
          _rows: data._rows,
          _transposes: Object.assign({}, data._transposes, { [inKey]: asKey }),
          _detransposes: Object.assign({}, data._detransposes, { [asKey]: inKey }),
          _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
          renderId
        }));
      }
    },
    classes: {
      description: 'Group & split data by a column',
      type: new _graphql.GraphQLList(AxisType),
      args: {
        key: {
          description: 'Key (column) in dataset',
          type: _graphql.GraphQLString
        },
        all: {
          description: 'Alias for total',
          type: _graphql.GraphQLString
        },
        total: {
          description: 'Include entry for total with this label',
          type: _graphql.GraphQLString
        },
        orderBy: {
          description: 'Order by values of another column',
          type: _graphql.GraphQLString
        },
        renderId: {
          description: 'Unique id for use when coordinating rendering',
          type: _graphql.GraphQLString
        },
        mapping: {
          description: 'Explicit mapping of labels to values',
          type: new _graphql.GraphQLList(_inputTypes.GroupMapType)
        },
        ordering: {
          description: 'Explicit ordering of values',
          type: new _graphql.GraphQLList(_graphql.GraphQLString)
        },
        delimiter: {
          description: 'Treat as multiple values using this delimiter',
          type: _graphql.GraphQLString
        }
      },
      resolve: (data, {
        key,
        all,
        total,
        orderBy,
        renderId,
        mapping,
        ordering,
        delimiter
      }, context) => {
        data._aggIndex++;
        const options = context.retabulateOptions || {};
        const { minimum, showRedacted } = options;

        // a 'total' never groups again, just descends
        if (data._isTotal) {
          return [Object.assign({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
        }

        // resolve any transposition first
        const dataKey = data._detransposes[key] || key;

        const groups = data._rows.descend(dataKey, delimiter ? { delimiter } : null);
        const value = [];

        if (mapping) {
          // build list of possible values, to track umapped keys left over
          const allGroups = groups.keys().reduce((all, k) => Object.assign({}, all, { [k]: true }), {});

          mapping.forEach(({ label, values }) => {
            const basics = Object.assign({}, data, {
              key: label,
              _aggIndex: data._aggIndex,
              _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
              renderId
            });

            if (values) {
              const rows = groups.keys(values);

              // drop this one from the remaining 'all' grouping
              for (let val of values) allGroups[val] = false;

              // if minimum provide, ensure group passes it
              if (minimum && rows.length < minimum) {
                // if showRedacted, pass empty set but flag as redacted
                if (showRedacted) return value.push(Object.assign({}, basics, {
                  _rows: [],
                  _redacted: true,
                  _query: Object.assign({}, data._query, { [dataKey]: values })
                }));
                return;
              }

              return value.push(Object.assign({}, basics, {
                _rows: rows,
                _redacted: false,
                _query: Object.assign({}, data._query, { [dataKey]: values })
              }));
            }

            // if no values provided with label, assume "group all remaining"
            const remainingValues = Object.keys(allGroups).filter(k => allGroups[k]);
            const coveredValues = Object.keys(allGroups).filter(k => !allGroups[k]);

            value.push(Object.assign({}, basics, {
              _redacted: false,
              _rows: remainingValues ? remainingValues.reduce((all, v) => all.concat(groups[v]), []) : [],
              _query: Object.assign({}, data._query, { [dataKey]: remainingValues })
            }));
          });
        } else {
          // no explicit mapping passed: group all, unless 'ordering' list passed
          const valuesSet = ordering ? ordering : groups.keys();

          valuesSet.forEach(groupValue => {
            const rows = groups.keys(groupValue);

            // check minimum threshold if setting provided
            if (minimum && rows.length < minimum) {
              if (showRedacted) value.push(Object.assign({}, data, {
                key: groupValue,
                _rows: [],
                _redacted: true,
                _aggIndex: data._aggIndex,
                _query: Object.assign({}, data._query, { [dataKey]: groupValue }),
                _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
                renderId
              }));
              return;
            }

            value.push(Object.assign({}, data, {
              key: groupValue,
              _rows: rows,
              _redacted: false,
              _aggIndex: data._aggIndex,
              _query: Object.assign({}, data._query, { [dataKey]: groupValue }),
              _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
              renderId
            }));
          });
        }

        // apply optional ordering by another column
        if (orderBy) {
          value.sort(orderBy === '_ASC' || orderBy === '_DESC' ?
          // special case: _ASC / _DESC based on row count
          (a, b) => a._rows.length > b._rows.length ? orderBy === '_ASC' ? 1 : -1 : orderBy === '_ASC' ? -1 : 1 : (a, b) => a._rows.data[0][orderBy] > b._rows.data[0][orderBy] ? 1 : -1);
        }

        // add in the total group if all / total requested
        if (all || total) value.push(Object.assign({}, data, {
          key: all,
          _aggIndex: data._aggIndex,
          renderIds: (0, _helpers.concat)(data._renderIds, renderId),
          renderId
        }));

        // if no groupings have resulted due to exclusions, include empty group
        if (value.length === 0) {
          value.push(Object.assign({}, data, {
            _rows: [],
            key: '(none)',
            _redacted: true,
            _aggIndex: data._aggIndex,
            renderIds: (0, _helpers.concat)(data._renderIds, renderId),
            renderId
          }));
        }

        return value;
      }
    }
  })
});

exports.default = AxisType;