'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gauss = require('gauss');

var _gauss2 = _interopRequireDefault(_gauss);

var _dataCollection = require('data-collection');

var _dataCollection2 = _interopRequireDefault(_dataCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// gauss library has terrible import strategy on client
var Vector = _typeof(window !== 'undefined') ? window.gauss.Vector : _gauss2.default.Vector;
var concat = function concat(arr, val) {
  return val ? arr.concat([val]) : arr;
};
// distribute filter args if array
var filterAny = function filterAny(collection, filters) {
  return Object.keys(filters).reduce(function (filtered, key) {
    return filters[key].map ? filtered.filter.apply(filtered, filters[key].map(function (v) {
      return _defineProperty({}, key, v);
    })) : filtered.filter(_defineProperty({}, key, filters[key]));
  }, collection);
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
  // diff option: calculate each, return difference, % difference
  if (diff) return function (series, key, over) {
    var b = aggregations[aggs](series, key, over);
    var a = aggregations[aggs](diff, key, diffOver);

    console.log({ aggs: aggs, a: a, b: b, series: series, diff: diff });

    return {
      diff: b - a,
      diff_pct: (b - a) / a
    };
  };
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
    return new Vector(series.exclude(_defineProperty({}, key, '')).values(key)).distribution();
  },
  distributionRatio: function distributionRatio(series, key) {
    return new Vector(series.exclude(_defineProperty({}, key, '')).values(key)).distribution('relative');
  },
  n: function n(series, key) {
    return series.exclude(_defineProperty({}, key, '')).count() || 0;
  },
  pctn: function pctn(series, key, over) {
    return series.exclude(_defineProperty({}, key, '')).count() / over.exclude(_defineProperty({}, key, '')).count() * 100;
  },
  mean: function mean(series, key) {
    return series.count() ? series.exclude(_defineProperty({}, key, '')).avg(key) : undefined;
  },
  median: function median(series, key) {
    return new Vector(series.values(key)).median();
  },
  mode: function mode(series, key) {
    return series.mode(key);
  },
  stdev: function stdev(series, key) {
    return new Vector(series.exclude(_defineProperty({}, key, '')).values(key)).stdev();
  },
  min: function min(series, key) {
    return series.exclude(_defineProperty({}, key, '')).min(key);
  },
  max: function max(series, key) {
    return series.max(key);
  },
  range: function range(series) {
    return series.range();
  },
  sum: function sum(series, key) {
    return series.sum(key) || 0;
  }
};

var resolvers = {
  Query: {
    table: function table(root, _ref2, context) {
      var set = _ref2.set,
          where = _ref2.where;

      return new Promise(function (resolve, reject) {
        context.getDataset(set).then(function (data) {

          if (!data) {
            throw new Error('dataset ' + set + ' not found');
          }

          context.tabulate = { iterator: 0 };
          var collection = new _dataCollection2.default(data).query();

          if (where) collection = filterAny(collection, where.reduce(function (all, _ref3) {
            var key = _ref3.key,
                values = _ref3.values;
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
    length: function length(_ref4) {
      var _rows = _ref4._rows;
      return _rows.count();
    },
    top: function top(data, args) {
      return _extends({}, data, { key: null, _axis: 'x' });
    },
    left: function left(data, args) {
      return _extends({}, data, { key: null, _axis: 'y' });
    },
    // after delay of other resolvers, process cells grid
    rows: function rows(_ref5) {
      var _rows = _ref5._rows,
          _grid = _ref5._grid;
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
    label: function label(_ref6) {
      var key = _ref6.key;
      return key;
    },
    length: function length(_ref7) {
      var _rows = _ref7._rows;
      return _rows.count();
    },
    classes: function classes(data, _ref8) {
      var key = _ref8.key,
          all = _ref8.all,
          total = _ref8.total,
          orderBy = _ref8.orderBy,
          renderId = _ref8.renderId,
          mapping = _ref8.mapping,
          ordering = _ref8.ordering;

      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [_extends({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
      }

      var dataKey = data._detransposes[key] || key;
      var value = void 0;
      var cumulative = mapping.reduce(function (all, next) {
        return next.values ? all.concat(next.values) : all;
      }, []);

      if (mapping) {
        value = mapping.map(function (_ref9) {
          var label = _ref9.label,
              values = _ref9.values;

          var rows = values
          // filter 
          ? data._rows.filter.apply(data._rows, values.map(function (v) {
            return _defineProperty({}, dataKey, v);
          }))
          // unfiltered remaining rows
          : cumulative.reduce(function (remaining, filter) {
            return remaining.exclude(_defineProperty({}, dataKey, filter));
          }, data._rows);

          return _extends({}, data, {
            key: label,
            _rows: rows,
            _aggIndex: data._aggIndex,
            _query: values ? _extends({}, data._query, _defineProperty({}, dataKey, values)) : data.query,
            _exclude: values ? data._exclude : [].concat(_toConsumableArray(data._exclude), _toConsumableArray(cumulative.map(function (v) {
              return _defineProperty({}, dataKey, v);
            }))),
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });
        });
      } else {
        var valuesSet = ordering ? ordering : data._rows.distinct(dataKey);
        value = valuesSet.map(function (groupValue) {
          return _extends({}, data, {
            key: groupValue,
            _rows: data._rows.filter(_defineProperty({}, dataKey, groupValue)),
            _aggIndex: data._aggIndex,
            _query: _extends({}, data._query, _defineProperty({}, dataKey, groupValue)),
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });
        });
      }

      if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
        return v._rows.first()[orderBy];
      });

      if (all || total) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId: renderId }));

      return value;
    },
    transpose: function transpose(data, _ref12) {
      var keys = _ref12.keys,
          asKey = _ref12.asKey,
          renderId = _ref12.renderId;

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
    all: function all(data, _ref13) {
      var label = _ref13.label,
          renderId = _ref13.renderId;
      return _extends({}, data, {
        label: label, key: label,
        renderId: renderId, _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      });
    },
    renderIds: function renderIds(_ref14) {
      var _renderIds = _ref14._renderIds;
      return _renderIds;
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    variable: function variable(data, _ref15) {
      var key = _ref15.key,
          keys = _ref15.keys,
          renderId = _ref15.renderId;
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
    value: function value(data, _ref16) {
      var _value2 = _ref16.value,
          values = _ref16.values,
          renderId = _ref16.renderId;
      return _extends({}, data, { _value: _value2 || values, _renderIds: concat(data._renderIds, renderId)
      });
    },
    aggregation: function aggregation(data, _ref17) {
      var method = _ref17.method,
          methods = _ref17.methods,
          diff = _ref17.diff,
          over = _ref17.over,
          renderId = _ref17.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    statistic: function statistic(data, _ref18) {
      var method = _ref18.method,
          methods = _ref18.methods,
          diff = _ref18.diff,
          over = _ref18.over,
          renderId = _ref18.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    renderIds: function renderIds(_ref19) {
      var _renderIds = _ref19._renderIds;
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
    renderIds: function renderIds(_ref20) {
      var _renderIds = _ref20._renderIds;
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
    value: function value(_ref21, _ref22) {
      var query = _ref21.query,
          detransposes = _ref21.detransposes,
          variable = _ref21.variable,
          agg = _ref21.agg,
          diff = _ref21.diff,
          diffOver = _ref21.diffOver,
          over = _ref21.over,
          rows = _ref21.rows,
          fmt = _ref21.fmt;
      var missing = _ref22.missing;

      return JSON.stringify(applyAggregations(agg, diff, diffOver)(rows, detransposes[variable] || variable, over));
    },
    queries: function queries(_ref23) {
      var query = _ref23.query;
      return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
        return { key: key, value: query[key] };
      });
    }
  },
  QueryCondition: {}
};

exports.default = resolvers;