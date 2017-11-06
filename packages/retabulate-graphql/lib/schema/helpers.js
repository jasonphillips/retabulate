'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregations = exports.applyAggregations = exports.generateLeaf = exports.addFilters = exports.concat = exports.distributionRatio = exports.distribution = exports.colValues = exports.groupBy = exports.CollectionMap = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3A = require('d3-array');
var d3C = require('d3-collection');

var CollectionMap = exports.CollectionMap = function () {
  function CollectionMap(data) {
    _classCallCheck(this, CollectionMap);

    this.data = data || [];
    this.length = this.data.length;
    if (!this._groups) this._groups = {};
  }

  _createClass(CollectionMap, [{
    key: 'descend',
    value: function descend(col) {
      if (this._groups[col]) return this._groups[col];

      var groups = groupBy(this.data, col);
      var groupKeys = Object.keys(groups);
      var memo = {};

      this._groups[col] = {
        keys: function keys(_keys) {
          if (!_keys) return groupKeys;
          var memoKey = _keys.map ? _keys.sort().join('||') : _keys;
          if (!memo[memoKey]) {
            var rows = _keys.map ? _keys.reduce(function (rows, key) {
              return rows.concat(groups[key]);
            }, []) : groups[_keys];

            memo[memoKey] = new CollectionMap(rows);
          }
          return memo[memoKey];
        }
      };

      return this._groups[col];
    }
  }, {
    key: 'filterAny',
    value: function filterAny(filters) {
      if (!Object.keys(filters).length) return this;

      var rows = this.data;
      var remaining = Object.assign({}, filters);
      var useFilter = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(filters)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var filter = _step.value;

          if (this._groups[filter]) {
            useFilter = filter;
            break;
          }
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

      if (!useFilter) useFilter = Object.keys(filters)[0];

      var applied = this.descend(useFilter).keys(filters[useFilter]);
      delete remaining[useFilter];

      if (!Object.keys(remaining).length) return new CollectionMap(applied.data);
      return applied.filterAny(remaining);
    }
  }]);

  return CollectionMap;
}();

var groupBy = exports.groupBy = function groupBy(rows, col) {
  return d3C.nest().key(function (row) {
    return row[col];
  }).object(rows);
};

var colValues = exports.colValues = function colValues(rows, col, excludeEmpty) {
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
  }).object(data);
};

exports.distribution = _distribution;
var _distributionRatio = function _distributionRatio(data) {
  return d3C.nest().key(function (d) {
    return d;
  }).rollup(function (v) {
    return v.length / data.length;
  }).object(data);
};

exports.distributionRatio = _distributionRatio;
var concat = exports.concat = function concat(arr, val) {
  return val ? arr.concat([val]) : arr;
};

var addFilters = exports.addFilters = function addFilters(objA, key, values) {
  return _extends({}, objA, _defineProperty({}, key, objA[key] ? (objA[key].map ? objA[key] : [objA[key]]).concat(values) : values));
};

var generateLeaf = exports.generateLeaf = function generateLeaf(data, context) {
  var _aggIndex = data._aggIndex,
      _renderIds = data._renderIds,
      _query = data._query,
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

var applyAggregations = exports.applyAggregations = function applyAggregations(aggs) {
  // single method
  if (!aggs.map) return aggregations[aggs];
  // mutliple: return as key => value
  return function (series, variable, over) {
    return aggs.reduce(function (combined, agg) {
      return _extends({}, combined, _defineProperty({}, agg, aggregations[agg](series, variable, over)));
    }, {});
  };
};

var aggregations = exports.aggregations = {
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
  pctsum: function pctsum(series, key, over) {
    return d3A.sum(colValues(series, key, true)) / d3A.sum(colValues(over, key, true)) * 100;
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