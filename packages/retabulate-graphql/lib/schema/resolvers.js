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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// gauss library has terrible import strategy on client
var Vector = _typeof(window !== 'undefined') ? window.gauss.Vector : _gauss2.default.Vector;
var concat = function concat(arr, val) {
  return val ? arr.concat([val]) : arr;
};
// distribute filter args if array
var filterAny = function filterAny(collection, filters) {
  return Object.keys(filters).reduce(function (filtered, key) {
    return filters[key].map ? collection.filter.apply(collection, filters[key].map(function (v) {
      return _defineProperty({}, key, v);
    })) : collection.filter(_defineProperty({}, key, filters[key]));
  }, collection);
};

var generateLeaf = function generateLeaf(data, context) {
  var _aggIndex = data._aggIndex,
      _renderIds = data._renderIds,
      _query = data._query,
      _variable = data._variable,
      _agg = data._agg,
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
    detransposes: _detransposes,
    variable: _variable,
    agg: _agg,
    over: _over,
    fmt: _fmt,
    renderIds: _renderIds
  });
  return id;
};

var applyAggregation = {
  distribution: function distribution(series, key) {
    return new Vector(series.values(key)).distribution();
  },
  distributionRatio: function distributionRatio(series, key) {
    return new Vector(series.values(key)).distribution('relative');
  },
  n: function n(series, key) {
    return series.count() || 0;
  },
  pctn: function pctn(series, key, over) {
    return series.count() / over * 100;
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

          if (where) collection = collection.filter(where.reduce(function (filter, _ref3) {
            var key = _ref3.key,
                value = _ref3.value;
            return _extends({}, filter, _defineProperty({}, key, value));
          }, {}));

          resolve({ _rows: collection, _query: {}, _grid: {}, _renderIds: [], _transposes: {}, _detransposes: {}, _aggIndex: 0 });
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

      if (mapping) {
        value = mapping.map(function (_ref9) {
          var label = _ref9.label,
              values = _ref9.values;

          var filters = values.map(function (v) {
            return _defineProperty({}, dataKey, v);
          });

          return _extends({}, data, {
            key: label,
            _rows: data._rows.filter.apply(data._rows, filters),
            _aggIndex: data._aggIndex,
            _query: _extends({}, data._query, _defineProperty({}, dataKey, values)),
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
    transpose: function transpose(data, _ref11) {
      var keys = _ref11.keys,
          asKey = _ref11.asKey,
          renderId = _ref11.renderId;

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
    all: function all(data, _ref12) {
      var label = _ref12.label,
          renderId = _ref12.renderId;
      return _extends({}, data, {
        label: label, key: label,
        renderId: renderId, _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      });
    },
    renderIds: function renderIds(_ref13) {
      var _renderIds = _ref13._renderIds;
      return _renderIds;
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    variable: function variable(data, _ref14) {
      var key = _ref14.key,
          keys = _ref14.keys,
          renderId = _ref14.renderId;
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
    aggregation: function aggregation(data, _ref15) {
      var method = _ref15.method,
          over = _ref15.over,
          renderId = _ref15.renderId;
      return _extends({}, data, { _agg: method, _over: over, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    statistic: function statistic(data, _ref16) {
      var method = _ref16.method,
          over = _ref16.over,
          renderId = _ref16.renderId;
      return _extends({}, data, { _agg: method, _over: over, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    renderIds: function renderIds(_ref17) {
      var _renderIds = _ref17._renderIds;
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
    renderIds: function renderIds(_ref18) {
      var _renderIds = _ref18._renderIds;
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
        var query = _extends({}, y.query, x.query);
        var agg = y.agg || x.agg || 'n';
        var over = y.over || x.over || null;
        var overQuery = over ? _lodash2.default.omit(query, over) : null;
        var detransposes = _extends({}, x.detransposes, y.detransposes);

        return {
          query: query,
          variable: detransposes[y.variable] || y.variable || detransposes[x.variable] || x.variable || null,
          agg: agg,
          detransposes: detransposes,
          colID: x.id,
          rowID: y.id,
          rows: filterAny(y._rows, x.query),
          over: over ? filterAny(y._all, overQuery).count() : null,
          fmt: y.fmt || x.fmt || '',
          renderIds: x.renderIds.concat(y.renderIds)
        };
      });
    }
  },
  Cell: {
    value: function value(_ref19, _ref20) {
      var query = _ref19.query,
          detransposes = _ref19.detransposes,
          variable = _ref19.variable,
          agg = _ref19.agg,
          over = _ref19.over,
          rows = _ref19.rows,
          fmt = _ref19.fmt;
      var missing = _ref20.missing;

      return JSON.stringify(applyAggregation[agg](rows, detransposes[variable] || variable, over));
    },
    queries: function queries(_ref21) {
      var query = _ref21.query;
      return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
        return { key: key, value: query[key] };
      });
    }
  },
  QueryCondition: {}
};

exports.default = resolvers;