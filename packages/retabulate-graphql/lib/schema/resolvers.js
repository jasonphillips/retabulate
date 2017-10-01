'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var d3A = require('d3-array');
var d3C = require('d3-collection');

var groupBy = function groupBy(rows, col) {
  return d3C.nest().key(function (row) {
    return row[col];
  }).entries(rows).reduce(function (all, _ref) {
    var key = _ref.key,
        value = _ref.value;
    return Object.assign(all, _defineProperty({}, key, value));
  }, {});
};

var colValues = function colValues(rows, col, excludeEmpty) {
  return rows.map(function (r) {
    return r[col];
  }).filter(function (r) {
    return excludeEmpty ? r !== '' && r !== false && r !== null : r;
  });
};

var _distribution = function _distribution(data) {
  return d3C.nest().key(function (d) {
    return d;
  }).rollup(function (v) {
    return v.length;
  }).entries(data).reduce(function (all, _ref2) {
    var key = _ref2.key,
        value = _ref2.value;
    return Object.assign(all, _defineProperty({}, key, value));
  }, {});
};

var _distributionRatio = function _distributionRatio(data) {
  return d3C.nest().key(function (d) {
    return d;
  }).rollup(function (v) {
    return v.length / data.length;
  }).entries(data).reduce(function (all, _ref3) {
    var key = _ref3.key,
        value = _ref3.value;
    return Object.assign(all, _defineProperty({}, key, value));
  }, {});
};

var concat = function concat(arr, val) {
  return val ? arr.concat([val]) : arr;
};

var filterAny = function filterAny(collection, filters) {
  return collection.filter(function (row) {
    return Object.keys(filters).reduce(function (passes, key) {
      if (!passes) return false;

      return filters[key].map ? filters[key].indexOf(row[key]) > -1 : row[key] === filters[key];
    }, true);
  });
};

var generateLeaf = function generateLeaf(data, context) {
  var _aggIndex = data._aggIndex,
      _renderIds = data._renderIds,
      _query = data._query,
      _exclude = data._exclude,
      _variable = data._variable,
      _value = data._value,
      _agg = data._agg,
      _diff = data._diff,
      _over = data._over,
      _fmt = data._fmt,
      _grid = data._grid,
      _axis = data._axis,
      _detransposes = data._detransposes;

  context.tabulate.iterator++;
  var id = ('00000000' + context.tabulate.iterator).slice(-8) + 't';
  if (!_grid[_axis]) _grid[_axis] = [];

  _grid[_axis].push({
    id: id,
    index: _aggIndex,
    query: _extends({}, _query),
    exclude: _exclude,
    detransposes: _detransposes,
    variable: _variable,
    agg: _agg,
    diff: _diff,
    over: _over,
    fmt: _fmt,
    value: _value,
    renderIds: _renderIds
  });
  return id;
};

var applyAggregations = function applyAggregations(aggs, diff, diffOver) {
  // single method
  if (!aggs.map) return aggregations[aggs];
  // mutliple: return as key => value
  return function (series, variable, over) {
    return aggs.reduce(function (combined, agg) {
      return _extends({}, combined, _defineProperty({}, agg, aggregations[agg](series, variable, over)));
    }, {});
  };
};

var aggregations = {
  distribution: function distribution(series, key) {
    return _distribution(colValues(series, key, true));
  },
  distributionRatio: function distributionRatio(series, key) {
    return _distributionRatio(colValues(series, key, true));
  },
  n: function n(series, key) {
    return colValues(series, key, true).length || 0;
  },
  pctn: function pctn(series, key, over) {
    return colValues(series, key, true).length / colValues(over, key, true).length * 100;
  },
  mean: function mean(series, key) {
    return series.length ? d3A.mean(colValues(series, key, true)) : undefined;
  },
  median: function median(series, key) {
    return d3A.median(series.values(key));
  },
  mode: function mode(series, key) {
    return d3A.mode(colValues(series, key));
  },
  stdev: function stdev(series, key) {
    return d3A.deviation(series.values(key));
  },
  min: function min(series, key) {
    return d3A.min(colValues(series, key));
  },
  max: function max(series, key) {
    return d3A.max(colValues(series, key));
  },
  range: function range(series) {
    return d3A.range(colValues(series, key));
  },
  sum: function sum(series, key) {
    return d3A.sum(colValues(series, key)) || 0;
  }
};

var resolvers = {
  Query: {
    table: function table(root, _ref4, context) {
      var set = _ref4.set,
          where = _ref4.where;

      return new Promise(function (resolve, reject) {
        context.getDataset(set).then(function (collection) {

          if (!collection) {
            throw new Error('dataset ' + set + ' not found');
          }

          context.tabulate = { iterator: 0 };
          // let collection = new DataCollection(data).query();

          if (where) collection = filterAny(collection, where.reduce(function (all, _ref5) {
            var key = _ref5.key,
                values = _ref5.values;
            return _extends({}, all, _defineProperty({}, key, values));
          }, {}));

          resolve({
            _rows: collection,
            _query: {}, _grid: {}, _renderIds: [], _transposes: {}, _detransposes: {}, _exclude: [], _aggIndex: 0 });
        });
      });
    }
  },
  Table: {
    length: function length(_ref6) {
      var _rows = _ref6._rows;
      return _rows.length;
    },
    top: function top(data, args) {
      return _extends({}, data, { key: null, _axis: 'x' });
    },
    left: function left(data, args) {
      return _extends({}, data, { key: null, _axis: 'y' });
    },
    // after delay of other resolvers, process cells grid
    rows: function rows(_ref7) {
      var _rows = _ref7._rows,
          _grid = _ref7._grid;
      return new Promise(function (resolve, rej) {
        return process.nextTick(function () {
          resolve(_lodash2.default.map(_lodash2.default.sortBy(_grid.y, 'id'), function (y) {
            return _extends({}, y, {
              _grid: _grid,
              _rows: filterAny(_rows, y.query),
              _all: _rows
            });
          }));
        });
      });
    }
  },
  Axis: {
    label: function label(_ref8) {
      var key = _ref8.key;
      return key;
    },
    length: function length(_ref9) {
      var _rows = _ref9._rows;
      return _rows.length;
    },
    classes: function classes(data, _ref10) {
      var key = _ref10.key,
          all = _ref10.all,
          total = _ref10.total,
          orderBy = _ref10.orderBy,
          renderId = _ref10.renderId,
          mapping = _ref10.mapping,
          ordering = _ref10.ordering;

      data._aggIndex++;
      // total never groups again, just descends
      if (data._isTotal) {
        return [_extends({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
      }

      var dataKey = data._detransposes[key] || key;
      var groups = groupBy(data._rows, dataKey);
      var value = void 0;

      if (mapping) {
        // build list of possible values, to track umapped / remainder
        var allGroups = Object.keys(groups).reduce(function (all, k) {
          return _extends({}, all, _defineProperty({}, k, true));
        }, {});
        // iterate over mappings
        value = mapping.map(function (_ref11) {
          var label = _ref11.label,
              values = _ref11.values;


          var basics = _extends({}, data, {
            key: label,
            _aggIndex: data._aggIndex,
            _exclude: values ? data._exclude : [].concat(_toConsumableArray(data._exclude), _toConsumableArray(cumulative.map(function (v) {
              return _defineProperty({}, dataKey, v);
            }))),
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });

          if (values) {
            var rows = values.reduce(function (combined, val) {
              allGroups[val] == false;
              return combined.concat(groups[val]);
            }, []);

            return _extends({}, basics, {
              _rows: rows,
              _query: _extends({}, data._query, _defineProperty({}, dataKey, values))
            });
          }

          // if no values, assume "group all remaining"
          var remainingValues = Object.keys(allGroups).filter(function (k) {
            return !allGroups[k];
          });
          var coveredValues = Object.keys(allGroups).filter(function (k) {
            return allGroups[k];
          });

          return _extends({}, basics, {
            _rows: remainingValues ? remainingValues.reduce(function (all, v) {
              return all.concat(groups[v]);
            }, []) : [],
            _exclude: [].concat(_toConsumableArray(data._exclude), _toConsumableArray(coveredValues.map(function (v) {
              return _defineProperty({}, dataKey, v);
            })))
          });
        });
      } else {
        // no explicit mapping passed, group all, unless 'ordering' list passed
        var valuesSet = ordering ? ordering : Object.keys(groups);

        value = valuesSet.map(function (groupValue) {
          return _extends({}, data, {
            key: groupValue,
            _rows: groups[groupValue],
            _aggIndex: data._aggIndex,
            _query: _extends({}, data._query, _defineProperty({}, dataKey, groupValue)),
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });
        });
      }

      // apply optional ordering by another column
      if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
        return v._rows[0][orderBy];
      });

      // add in the total group if all / total requested
      if (all || total) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId: renderId }));

      return value;
    },
    transpose: function transpose(data, _ref14) {
      var keys = _ref14.keys,
          asKey = _ref14.asKey,
          renderId = _ref14.renderId;

      data._aggIndex++;

      return keys.map(function (inKey) {
        return _extends({}, data, {
          key: inKey,
          _rows: data._rows,
          _transposes: _extends({}, data._transposes, _defineProperty({}, inKey, asKey)),
          _detransposes: _extends({}, data._detransposes, _defineProperty({}, asKey, inKey)),
          _renderIds: concat(data._renderIds, renderId),
          renderId: renderId
        });
      });
    },
    all: function all(data, _ref15) {
      var label = _ref15.label,
          renderId = _ref15.renderId;
      return _extends({}, data, {
        label: label, key: label,
        renderId: renderId, _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      });
    },
    renderIds: function renderIds(_ref16) {
      var _renderIds = _ref16._renderIds;
      return _renderIds;
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    variable: function variable(data, _ref17) {
      var key = _ref17.key,
          keys = _ref17.keys,
          renderId = _ref17.renderId;
      return _extends({}, data, { _variable: keys || key, key: key, _renderIds: concat(data._renderIds, renderId) });
    }
  },
  Node: {
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    node: function node(data) {
      return data;
    }
  },
  Variable: {
    value: function value(data, _ref18) {
      var _value2 = _ref18.value,
          values = _ref18.values,
          renderId = _ref18.renderId;
      return _extends({}, data, { _value: _value2 || values, _renderIds: concat(data._renderIds, renderId)
      });
    },
    aggregation: function aggregation(data, _ref19) {
      var method = _ref19.method,
          methods = _ref19.methods,
          diff = _ref19.diff,
          over = _ref19.over,
          renderId = _ref19.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    statistic: function statistic(data, _ref20) {
      var method = _ref20.method,
          methods = _ref20.methods,
          diff = _ref20.diff,
          over = _ref20.over,
          renderId = _ref20.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    all: function all(data, _ref21) {
      var label = _ref21.label,
          renderId = _ref21.renderId;
      return _extends({}, data, {
        renderId: renderId,
        label: label,
        _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      });
    },
    renderIds: function renderIds(_ref22) {
      var _renderIds = _ref22._renderIds;
      return _renderIds;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    node: function node(data) {
      return data;
    }
  },
  Aggregation: {
    renderIds: function renderIds(_ref23) {
      var _renderIds = _ref23._renderIds;
      return _renderIds;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    node: function node(data) {
      return data;
    }
  },
  Row: {
    cells: function cells(y, args) {
      return _lodash2.default.map(y._grid.x, function (x) {
        var detransposes = _extends({}, x.detransposes, y.detransposes);
        var variable = detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null;
        var value = y.value || x.value || null;
        var exclude = y.exclude.length || x.exclude.length ? [].concat(_toConsumableArray(y.exclude), _toConsumableArray(x.exclude)) : null;

        var query = _extends({}, y.query, x.query);
        var cellFilter = x.query;
        var diffRows = void 0;
        var diffOver = void 0;

        if (variable && value !== null) {
          cellFilter = _extends({}, cellFilter, _defineProperty({}, variable, value));
          query = _extends({}, query, _defineProperty({}, variable, value));
        }

        var agg = y.agg || x.agg || 'n';
        var over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
        var overQuery = over ? _lodash2.default.omit(query, over) : null;

        var rows = filterAny(y._rows, cellFilter);

        if (y.diff || x.diff) {
          var diff = x.diff || y.diff;
          diffRows = filterAny(y._all, _lodash2.default.omit(query, diff.key));
          diffOver = filterAny(y._all, _lodash2.default.omit(query, [diff.key, over]));

          if (diff.values) {
            diffRows = filterAny(diffRows, _defineProperty({}, diff.key, diff.values));
            diffOver = filterAny(diffOver, _defineProperty({}, diff.key, diff.values));
          }
        }

        return {
          query: query,
          variable: variable,
          agg: agg,
          detransposes: detransposes,
          colID: x.id,
          rowID: y.id,
          rows: exclude ? exclude.reduce(function (r, e) {
            return r.exclude(e);
          }, rows) : rows,
          over: over ? filterAny(y._all, overQuery) : null,
          diff: diffRows,
          diffOver: diffOver,
          fmt: y.fmt || x.fmt || '',
          renderIds: x.renderIds.concat(y.renderIds)
        };
      });
    }
  },
  Cell: {
    value: function value(_ref24, _ref25) {
      var query = _ref24.query,
          detransposes = _ref24.detransposes,
          variable = _ref24.variable,
          agg = _ref24.agg,
          diff = _ref24.diff,
          diffOver = _ref24.diffOver,
          over = _ref24.over,
          rows = _ref24.rows,
          fmt = _ref24.fmt;
      var missing = _ref25.missing;

      return JSON.stringify(diff
      // if diff: calculate this group, diff group
      ? {
        group: applyAggregations(agg)(rows, detransposes[variable] || variable, over),
        diff: applyAggregations(agg)(diff, detransposes[variable] || variable, diffOver)
      } : applyAggregations(agg, diff, diffOver)(rows, detransposes[variable] || variable, over));
    },
    queries: function queries(_ref26) {
      var query = _ref26.query;
      return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
        return { key: key, value: query[key] };
      });
    }
  },
  QueryCondition: {}
};

exports.default = resolvers;