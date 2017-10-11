'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _type = require('graphql/type');

var _helpers = require('./helpers');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ConditionType = new _type.GraphQLInputObjectType({
  name: 'ConditionType',
  fields: {
    key: {
      type: _type.GraphQLString
    },
    values: {
      type: new _type.GraphQLList(_type.GraphQLString)
    }
  }
});

var QueryConditionType = new _type.GraphQLObjectType({
  name: 'QueryConditionType',
  fields: {
    key: {
      type: _type.GraphQLString
    },
    value: {
      type: _type.GraphQLString
    }
  }
});

var GroupMapType = new _type.GraphQLInputObjectType({
  name: 'GroupMapType',
  fields: {
    label: {
      type: new _type.GraphQLNonNull(_type.GraphQLString)
    },
    values: {
      type: new _type.GraphQLList(_type.GraphQLString)
    }
  }
});

var NodeType = new _type.GraphQLObjectType({
  name: 'NodeType',
  fields: function fields() {
    return {
      leaf: {
        type: _type.GraphQLID,
        resolve: function resolve(data, args, context) {
          return (0, _helpers.generateLeaf)(data, context);
        }
      },
      node: {
        type: NodeType,
        resolve: function resolve(data) {
          return data;
        }
      }
    };
  }
});

var AggregationType = new _type.GraphQLObjectType({
  name: 'AggregationType',
  fields: function fields() {
    return {
      method: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref) {
          var method = _ref.method;
          return method;
        }
      },
      methods: {
        type: new _type.GraphQLList(_type.GraphQLString),
        resolve: function resolve(_ref2) {
          var methods = _ref2.methods;
          return methods;
        }
      },
      renderId: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref3) {
          var renderId = _ref3.renderId;
          return renderId;
        }
      },
      renderIds: {
        type: new _type.GraphQLList(_type.GraphQLString),
        resolve: function resolve(_ref4) {
          var _renderIds = _ref4._renderIds;
          return _renderIds;
        }
      },
      leaf: {
        type: _type.GraphQLID,
        resolve: function resolve(data, args, context) {
          return (0, _helpers.generateLeaf)(data, context);
        }
      },
      node: {
        type: NodeType,
        resolve: function resolve(data) {
          return data;
        }
      }
    };
  }
});

var VariableType = new _type.GraphQLObjectType({
  name: 'VariableType',
  fields: function fields() {
    return {
      key: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref5) {
          var key = _ref5.key;
          return key;
        }
      },
      keys: {
        type: new _type.GraphQLList(_type.GraphQLString),
        resolve: function resolve(_ref6) {
          var keys = _ref6.keys;
          return keys;
        }
      },
      renderId: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref7) {
          var renderId = _ref7.renderId;
          return renderId;
        }
      },
      renderIds: {
        type: new _type.GraphQLList(_type.GraphQLString),
        resolve: function resolve(_ref8) {
          var _renderIds = _ref8._renderIds;
          return _renderIds;
        }
      },
      label: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref9) {
          var label = _ref9.label;
          return label;
        }
      },
      statistic: {
        type: AggregationType,
        args: {
          method: { type: _type.GraphQLString },
          methods: { type: new _type.GraphQLList(_type.GraphQLString) },
          diff: { type: ConditionType },
          format: { type: _type.GraphQLString },
          over: { type: _type.GraphQLString },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref10) {
          var method = _ref10.method,
              methods = _ref10.methods,
              diff = _ref10.diff,
              over = _ref10.over,
              renderId = _ref10.renderId;
          return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: (0, _helpers.concat)(data._renderIds, renderId)
          });
        }
      },
      value: {
        type: VariableType,
        args: {
          value: { type: _type.GraphQLString },
          values: { type: new _type.GraphQLList(_type.GraphQLString) },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref11) {
          var value = _ref11.value,
              values = _ref11.values,
              renderId = _ref11.renderId;
          return _extends({}, data, { _value: value || values, _renderIds: (0, _helpers.concat)(data._renderIds, renderId)
          });
        }
      },
      all: {
        type: VariableType,
        args: {
          label: { type: _type.GraphQLString },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref12) {
          var label = _ref12.label,
              renderId = _ref12.renderId;
          return _extends({}, data, {
            renderId: renderId,
            label: label,
            _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
            _aggIndex: data._aggIndex + 1
          });
        }
      },
      leaf: {
        type: _type.GraphQLID,
        resolve: function resolve(data, args, context) {
          return (0, _helpers.generateLeaf)(data, context);
        }
      },
      node: {
        type: NodeType,
        resolve: function resolve(data) {
          return data;
        }
      }
    };
  }
});

var AxisType = new _type.GraphQLObjectType({
  name: 'AxisType',
  fields: function fields() {
    return {
      label: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref13) {
          var key = _ref13.key;
          return key;
        }
      },
      length: {
        type: _type.GraphQLInt,
        resolve: function resolve(_ref14) {
          var _rows = _ref14._rows;
          return _rows.length;
        }
      },
      leaf: {
        type: _type.GraphQLID,
        resolve: function resolve(data, args, context) {
          return (0, _helpers.generateLeaf)(data, context);
        }
      },
      renderId: {
        type: _type.GraphQLString,
        resolve: function resolve(_ref15) {
          var renderId = _ref15.renderId;
          return renderId;
        }
      },
      renderIds: {
        type: new _type.GraphQLList(_type.GraphQLString),
        resolve: function resolve(_ref16) {
          var _renderIds = _ref16._renderIds;
          return _renderIds;
        }
      },
      node: {
        type: AxisType,
        resolve: function resolve(data) {
          return data;
        }
      },
      all: {
        type: AxisType,
        args: {
          label: { type: _type.GraphQLString },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref17) {
          var label = _ref17.label,
              renderId = _ref17.renderId;
          return _extends({}, data, {
            label: label, key: label,
            renderId: renderId, _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
            _aggIndex: data._aggIndex + 1
          });
        }
      },
      variable: {
        type: VariableType,
        args: {
          key: { type: _type.GraphQLString },
          keys: { type: new _type.GraphQLList(_type.GraphQLString) },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref18) {
          var key = _ref18.key,
              keys = _ref18.keys,
              renderId = _ref18.renderId;
          return _extends({}, data, { _variable: keys || key, key: key, _renderIds: (0, _helpers.concat)(data._renderIds, renderId) });
        }
      },
      transpose: {
        type: new _type.GraphQLList(AxisType),
        args: {
          keys: { type: new _type.GraphQLList(_type.GraphQLString) },
          asKey: { type: _type.GraphQLString },
          renderId: { type: _type.GraphQLString }
        },
        resolve: function resolve(data, _ref19) {
          var keys = _ref19.keys,
              asKey = _ref19.asKey,
              renderId = _ref19.renderId;

          data._aggIndex++;

          return keys.map(function (inKey) {
            return _extends({}, data, {
              key: inKey,
              _rows: data._rows,
              _transposes: _extends({}, data._transposes, _defineProperty({}, inKey, asKey)),
              _detransposes: _extends({}, data._detransposes, _defineProperty({}, asKey, inKey)),
              _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
              renderId: renderId
            });
          });
        }
      },
      classes: {
        type: new _type.GraphQLList(AxisType),
        args: {
          key: { type: _type.GraphQLString },
          all: { type: _type.GraphQLString },
          total: { type: _type.GraphQLString },
          orderBy: { type: _type.GraphQLString },
          renderId: { type: _type.GraphQLString },
          mapping: { type: new _type.GraphQLList(GroupMapType) },
          ordering: { type: new _type.GraphQLList(_type.GraphQLString) }
        },
        resolve: function resolve(data, _ref20) {
          var key = _ref20.key,
              all = _ref20.all,
              total = _ref20.total,
              orderBy = _ref20.orderBy,
              renderId = _ref20.renderId,
              mapping = _ref20.mapping,
              ordering = _ref20.ordering;

          data._aggIndex++;
          // total never groups again, just descends
          if (data._isTotal) {
            return [_extends({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
          }

          var dataKey = data._detransposes[key] || key;
          //const groups = groupBy(data._rows, dataKey);
          var groups = data._rows.descend(dataKey);
          var value = void 0;

          if (mapping) {
            // build list of possible values, to track umapped / remainder
            var allGroups = groups.keys().reduce(function (all, k) {
              return _extends({}, all, _defineProperty({}, k, true));
            }, {});
            // iterate over mappings
            value = mapping.map(function (_ref21) {
              var label = _ref21.label,
                  values = _ref21.values;


              var basics = _extends({}, data, {
                key: label,
                _aggIndex: data._aggIndex,
                _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
                renderId: renderId
              });

              if (values) {
                var rows = groups.keys(values);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;
                    allGroups[val] = false;
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                return _extends({}, basics, {
                  _rows: rows,
                  _query: _extends({}, data._query, _defineProperty({}, dataKey, values))
                });
              }

              // if no values, assume "group all remaining"
              var remainingValues = Object.keys(allGroups).filter(function (k) {
                return allGroups[k];
              });
              var coveredValues = Object.keys(allGroups).filter(function (k) {
                return !allGroups[k];
              });

              return _extends({}, basics, {
                _rows: remainingValues ? remainingValues.reduce(function (all, v) {
                  return all.concat(groups[v]);
                }, []) : [],
                _query: _extends({}, data._query, _defineProperty({}, dataKey, remainingValues))
              });
            });
          } else {
            // no explicit mapping passed, group all, unless 'ordering' list passed
            var valuesSet = ordering ? ordering : groups.keys();

            value = valuesSet.map(function (groupValue) {
              return _extends({}, data, {
                key: groupValue,
                _rows: groups.keys(groupValue),
                _aggIndex: data._aggIndex,
                _query: _extends({}, data._query, _defineProperty({}, dataKey, groupValue)),
                _renderIds: (0, _helpers.concat)(data._renderIds, renderId),
                renderId: renderId
              });
            });
          }

          // apply optional ordering by another column
          if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
            return v._rows.data[0][orderBy];
          });

          // add in the total group if all / total requested
          if (all || total) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex, renderIds: (0, _helpers.concat)(data._renderIds, renderId), renderId: renderId }));

          return value;
        }
      }
    };
  }
});

var CellType = new _type.GraphQLObjectType({
  name: 'CellType',
  fields: {
    agg: {
      type: _type.GraphQLString,
      agg: function agg(_ref22) {
        var _agg = _ref22.agg;
        return _agg;
      }
    },
    variable: {
      type: _type.GraphQLString,
      agg: function agg(_ref23) {
        var variable = _ref23.variable;
        return variable;
      }
    },
    renderId: {
      type: _type.GraphQLString,
      resolve: function resolve(_ref24) {
        var renderId = _ref24.renderId;
        return renderId;
      }
    },
    renderIds: {
      type: new _type.GraphQLList(_type.GraphQLString),
      resolve: function resolve(_ref25) {
        var renderIds = _ref25.renderIds;
        return renderIds;
      }
    },
    rowID: {
      type: _type.GraphQLID,
      resolve: function resolve(_ref26) {
        var rowID = _ref26.rowID;
        return rowID;
      }
    },
    colID: {
      type: _type.GraphQLID,
      resolve: function resolve(_ref27) {
        var colID = _ref27.colID;
        return colID;
      }
    },
    value: {
      type: _type.GraphQLString,
      args: {
        missing: { type: _type.GraphQLString }
      },
      resolve: function resolve(_ref28, _ref29) {
        var query = _ref28.query,
            detransposes = _ref28.detransposes,
            variable = _ref28.variable,
            agg = _ref28.agg,
            diff = _ref28.diff,
            diffOver = _ref28.diffOver,
            over = _ref28.over,
            rows = _ref28.rows,
            fmt = _ref28.fmt;
        var missing = _ref29.missing;

        return JSON.stringify(diff
        // if diff: calculate this group, diff group
        ? {
          group: (0, _helpers.applyAggregations)(agg)(rows, detransposes[variable] || variable, over),
          diff: (0, _helpers.applyAggregations)(agg)(diff, detransposes[variable] || variable, diffOver)
        } : (0, _helpers.applyAggregations)(agg, diff, diffOver)(rows, detransposes[variable] || variable, over));
      }
    },
    queries: {
      type: new _type.GraphQLList(QueryConditionType),
      resolve: function resolve(_ref30) {
        var query = _ref30.query;
        return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
          return { key: key, value: query[key] };
        });
      }
    }
  }
});

var RowType = new _type.GraphQLObjectType({
  name: 'RowType',
  fields: {
    cells: {
      type: new _type.GraphQLList(CellType),
      resolve: function resolve(y, args) {
        return _lodash2.default.map(y._grid.x, function (x) {
          var detransposes = _extends({}, x.detransposes, y.detransposes);
          var variable = detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null;
          var value = y.value || x.value || null;

          var query = _extends({}, y.query, x.query);
          var diffRows = void 0;
          var diffOver = void 0;

          if (variable && value !== null) {
            query = _extends({}, query, _defineProperty({}, variable, value));
          }

          var agg = y.agg || x.agg || 'n';
          var over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
          var overQuery = over ? _lodash2.default.omit(query, over) : null;

          var rows = y._rows.filterAny(query);

          if (y.diff || x.diff) {
            var diff = x.diff || y.diff;
            diffRows = y._all.filterAny(_lodash2.default.omit(query, diff.key));
            diffOver = y._all.filterAny(_lodash2.default.omit(query, [diff.key, over]));

            if (diff.values) {
              diffRows = diffRows.filterAny(_defineProperty({}, diff.key, diff.values));
              diffOver = diffOver.filterAny(_defineProperty({}, diff.key, diff.values));
            }
          }

          return {
            query: query,
            variable: variable,
            agg: agg,
            detransposes: detransposes,
            colID: x.id,
            rowID: y.id,
            rows: rows.data,
            over: over ? y._all.filterAny(overQuery).data : null,
            diff: diffRows ? diffRows.data : null,
            diffOver: diffOver ? diffOver.data : null,
            fmt: y.fmt || x.fmt || '',
            renderIds: x.renderIds.concat(y.renderIds)
          };
        });
      }
    }
  }
});

var TableType = new _type.GraphQLObjectType({
  name: 'TableType',
  fields: {
    top: {
      type: AxisType,
      resolve: function resolve(data, args) {
        return _extends({}, data, { key: null, _axis: 'x' });
      }
    },
    left: {
      type: AxisType,
      resolve: function resolve(data, args) {
        return _extends({}, data, { key: null, _axis: 'y' });
      }
    },
    length: {
      type: _type.GraphQLInt,
      resolve: function resolve(_ref31) {
        var _rows = _ref31._rows;
        return _rows.length;
      }
    },
    rows: {
      type: new _type.GraphQLList(RowType),
      resolve: function resolve(_ref32) {
        var _rows = _ref32._rows,
            _grid = _ref32._grid;
        return new Promise(function (resolve, rej) {
          return process.nextTick(function () {
            resolve(_lodash2.default.map(_lodash2.default.sortBy(_grid.y, 'id'), function (y) {
              return _extends({}, y, {
                _grid: _grid,
                _rows: _rows,
                _all: _rows
              });
            }));
          });
        });
      }
    }
  }
});

var RootType = new _type.GraphQLObjectType({
  name: 'RootType',
  fields: {
    table: {
      type: TableType,
      args: {
        set: { type: _type.GraphQLString },
        where: { type: new _type.GraphQLList(ConditionType) }
      },
      resolve: function resolve(root, _ref33, context) {
        var set = _ref33.set,
            where = _ref33.where;
        return new Promise(function (resolve, reject) {
          context.getDataset(set).then(function (data) {

            if (!data) {
              throw new Error('dataset ' + set + ' not found');
            }

            var collection = new _helpers.CollectionMap(data);
            context.tabulate = { iterator: 0 };

            if (where) collection = collection.filterAny(where.reduce(function (all, _ref34) {
              var key = _ref34.key,
                  values = _ref34.values;
              return _extends({}, all, _defineProperty({}, key, values));
            }, {}));

            resolve({
              _rows: collection,
              _query: {}, _grid: {}, _renderIds: [], _transposes: {}, _detransposes: {}, _exclude: {}, _aggIndex: 0 });
          });
        });
      }
    }
  }
});

var schema = new _type.GraphQLSchema({
  query: RootType
});

exports.default = schema;