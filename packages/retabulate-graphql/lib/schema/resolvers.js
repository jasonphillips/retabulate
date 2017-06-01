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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// gauss library has terrible import strategy on client
var Vector = _typeof(window !== 'undefined') ? window.gauss.Vector : _gauss2.default.Vector;

var md5 = function md5(val) {
  var c = _crypto2.default.createHash('md5');
  c.update(val);
  return c.digest('hex');
};

var generateLeaf = function generateLeaf(_ref) {
  var _aggIndex = _ref._aggIndex,
      _query = _ref._query,
      _variable = _ref._variable,
      _agg = _ref._agg,
      _over = _ref._over,
      _fmt = _ref._fmt,
      _grid = _ref._grid,
      _axis = _ref._axis;

  var id = md5(JSON.stringify(_query) + _variable + _agg);
  if (!_grid[_axis]) _grid[_axis] = [];
  _grid[_axis].push({
    id: id,
    index: _aggIndex,
    query: _extends({}, _query),
    variable: _variable,
    agg: _agg,
    over: _over,
    fmt: _fmt
  });
  return id;
};

var makeSeries = function makeSeries(query, variable, rows) {
  return rows.filter(query).values(variable);
};

var applyAggregation = {
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

var applyFormat = function applyFormat(fmt, missing) {
  var undefCheck = function undefCheck(n) {
    return n === undefined ? missing : false;
  };
  var SASparts = fmt.match(/^([A-Z]+)?(\d+)\.(\d*)$/);
  // SAS-like {precision}.{fixed}
  if (SASparts) {
    var prefix = SASparts[1];
    var precision = parseInt(SASparts[2]);
    var fixed = parseInt(SASparts[3] || '0');

    var applyPrefix = function applyPrefix(out) {
      return out;
    };
    if (prefix == 'COMMA') applyPrefix = function applyPrefix(out) {
      return parseFloat(out).toLocaleString();
    };
    if (prefix == 'DOLLAR') applyPrefix = function applyPrefix(out) {
      return '$' + parseFloat(out).toLocaleString();
    };

    if (!fixed) {
      return function (n) {
        return undefCheck(n) || applyPrefix(parseInt(n.toPrecision(precision)).toString());
      };
    }
    return function (n) {
      return undefCheck(n) || applyPrefix(parseFloat(n.toPrecision(precision - 1)).toFixed(fixed));
    };
  }
  // commas
  if (fmt === 'comma') return function (n) {
    return undefCheck(n) || n.toLocaleString();
  };
  // precision
  if (fmt.slice(0, 10) === 'precision|') {
    return function (n) {
      return undefCheck(n) || n.toPrecision(parseInt(fmt.slice(10)));
    };
  }
  // fixed
  if (fmt.slice(0, 6) === 'fixed|') {
    return function (n) {
      return undefCheck(n) || n.toFixed(parseInt(fmt.slice(6)));
    };
  }
  // default non-format
  return function (n) {
    return undefCheck(n) || n;
  };
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

          var collection = new _dataCollection2.default(data).query();

          if (where) {
            var filter = {};
            _lodash2.default.forEach(where, function (_ref3) {
              var key = _ref3.key,
                  value = _ref3.value;
              filter[key] = value;
            });
            return { _rows: collection.filter(filter), _query: {}, _grid: {}, _aggIndex: 0 };
          }

          resolve({ _rows: collection, _query: {}, _grid: {}, _aggIndex: 0 });
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
          orderBy = _ref8.orderBy;

      data._aggIndex++;

      // total never groups again, just descends
      if (data._isTotal) {
        return [_extends({}, data, { key: '_', _aggIndex: data._aggIndex, _isTotal: true })];
      }

      var value = data._rows.distinct(key).map(function (groupValue) {
        return _extends({}, data, {
          key: groupValue,
          _rows: data._rows.filter(_defineProperty({}, key, groupValue)),
          _aggIndex: data._aggIndex,
          _query: _extends({}, data._query, _defineProperty({}, key, groupValue))
        });
      });

      if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
        return v._rows.first()[orderBy];
      });

      if (all) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex }));

      if (total) value.push(_extends({}, data, { key: total, _aggIndex: data._aggIndex, _isTotal: total }));

      return value;
    },
    all: function all(data, _ref9) {
      var label = _ref9.label;
      data._aggIndex++;return _extends({}, data, { label: label, key: label });
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data) {
      return generateLeaf(data);
    },
    variable: function variable(data, _ref10) {
      var key = _ref10.key;
      return _extends({}, data, { _variable: key, key: key });
    }
  },
  Node: {
    leaf: function leaf(data) {
      return generateLeaf(data);
    },
    node: function node(data) {
      return data;
    }
  },
  Variable: {
    aggregation: function aggregation(data, _ref11) {
      var method = _ref11.method,
          over = _ref11.over,
          format = _ref11.format;
      return _extends({}, data, { _agg: method, _over: over, _fmt: format, method: method });
    },
    leaf: function leaf(data) {
      return generateLeaf(data);
    },
    node: function node(data) {
      return data;
    }
  },
  Aggregation: {
    leaf: function leaf(data) {
      return generateLeaf(data);
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

        return {
          query: query,
          variable: y.variable || x.variable || null,
          agg: agg,
          colID: x.id,
          rowID: y.id,
          rows: y._rows.filter(x.query),
          over: over ? y._all.filter(overQuery).count() : null,
          fmt: y.fmt || x.fmt || ''
        };
      });
    }
  },
  Cell: {
    value: function value(_ref12, _ref13) {
      var query = _ref12.query,
          variable = _ref12.variable,
          agg = _ref12.agg,
          over = _ref12.over,
          rows = _ref12.rows,
          fmt = _ref12.fmt;
      var missing = _ref13.missing;

      var aggregated = applyAggregation[agg](rows, variable, over);
      return applyFormat(fmt, missing || '.')(aggregated);
    },
    queries: function queries(_ref14) {
      var query = _ref14.query;
      return _lodash2.default.map(_lodash2.default.keys(query), function (key) {
        return { key: key, value: query[key] };
      });
    }
  },
  QueryCondition: {}
};

exports.default = resolvers;