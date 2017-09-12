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
  var id = 't' + context.tabulate.iterator;
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

var makeSeries = function makeSeries(query, variable, rows) {
  return rows.filter(query).values(variable);
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
    table: function table(root, _ref, context) {
      var set = _ref.set,
          where = _ref.where;

      return new Promise(function (resolve, reject) {
        context.getDataset(set).then(function (data) {

          if (!data) {
            throw new Error('dataset ' + set + ' not found');
          }

          context.tabulate = { iterator: 0 };
          var collection = new _dataCollection2.default(data).query();

          if (where) {
            var filter = {};
            _lodash2.default.forEach(where, function (_ref2) {
              var key = _ref2.key,
                  value = _ref2.value;
              filter[key] = value;
            });
            return {
              _rows: collection.filter(filter),
              _query: {},
              _transposes: {},
              _detransposes: {},
              _grid: {},
              _aggIndex: 0
            };
          }

          resolve({ _rows: collection, _query: {}, _grid: {}, _renderIds: [], _transposes: {}, _detransposes: {}, _aggIndex: 0 });
        });
      });
    }
  },
  Table: {
    length: function length(_ref3) {
      var _rows = _ref3._rows;
      return _rows.count();
    },
    top: function top(data, args) {
      return _extends({}, data, { key: null, _axis: 'x' });
    },
    left: function left(data, args) {
      return _extends({}, data, { key: null, _axis: 'y' });
    },
    // after delay of other resolvers, process cells grid
    rows: function rows(_ref4) {
      var _rows = _ref4._rows,
          _grid = _ref4._grid;
      return new Promise(function (resolve, rej) {
        return process.nextTick(function () {
          resolve(_lodash2.default.map(_lodash2.default.sortBy(_grid.y, 'index'), function (y) {
            return _extends({}, y, {
              _grid: _grid,
              _rows: _rows.filter(y.query),
              _all: _rows
            });
          }));
        });
      });
    }
  },
  Axis: {
    label: function label(_ref5) {
      var key = _ref5.key;
      return key;
    },
    length: function length(_ref6) {
      var _rows = _ref6._rows;
      return _rows.count();
    },
    classes: function classes(data, _ref7) {
      var key = _ref7.key,
          all = _ref7.all,
          total = _ref7.total,
          orderBy = _ref7.orderBy,
          renderId = _ref7.renderId;

      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [_extends({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
      }

      var dataKey = data._detransposes[key] || key;

      var value = data._rows.distinct(dataKey).map(function (groupValue) {
        return _extends({}, data, {
          key: groupValue,
          _rows: data._rows.filter(_defineProperty({}, dataKey, groupValue)),
          _aggIndex: data._aggIndex,
          _query: _extends({}, data._query, _defineProperty({}, dataKey, groupValue)),
          _renderIds: concat(data._renderIds, renderId),
          renderId: renderId
        });
      });

      if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
        return v._rows.first()[orderBy];
      });

      if (all) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId: renderId }));

      if (total) value.push(_extends({}, data, { key: total, _aggIndex: data._aggIndex, _isTotal: total }));

      return value;
    },
    transpose: function transpose(data, _ref8) {
      var keys = _ref8.keys,
          asKey = _ref8.asKey,
          renderId = _ref8.renderId;

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
    all: function all(data, _ref9) {
      var label = _ref9.label;
      data._aggIndex++;return _extends({}, data, { label: label, key: label });
    },
    renderIds: function renderIds(_ref10) {
      var _renderIds = _ref10._renderIds;
      return _renderIds;
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    variable: function variable(data, _ref11) {
      var key = _ref11.key,
          keys = _ref11.keys,
          renderId = _ref11.renderId;
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
    aggregation: function aggregation(data, _ref12) {
      var method = _ref12.method,
          over = _ref12.over,
          renderId = _ref12.renderId;
      return _extends({}, data, { _agg: method, _over: over, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    statistic: function statistic(data, _ref13) {
      var method = _ref13.method,
          over = _ref13.over,
          renderId = _ref13.renderId;
      return _extends({}, data, { _agg: method, _over: over, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    renderIds: function renderIds(_ref14) {
      var _renderIds = _ref14._renderIds;
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
    renderIds: function renderIds(_ref15) {
      var _renderIds = _ref15._renderIds;
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
          rows: y._rows.filter(x.query),
          over: over ? y._all.filter(overQuery).count() : null,
          fmt: y.fmt || x.fmt || '',
          renderIds: x.renderIds.concat(y.renderIds)
        };
      });
    }
  },
  Cell: {
    value: function value(_ref16, _ref17) {
      var query = _ref16.query,
          detransposes = _ref16.detransposes,
          variable = _ref16.variable,
          agg = _ref16.agg,
          over = _ref16.over,
          rows = _ref16.rows,
          fmt = _ref16.fmt;
      var missing = _ref17.missing;

      return JSON.stringify(applyAggregation[agg](rows, detransposes[variable] || variable, over));
    },
    queries: function queries(_ref18) {
      var query = _ref18.query;
      return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
        return { key: key, value: query[key] };
      });
    }
  },
  QueryCondition: {}
};

exports.default = resolvers;