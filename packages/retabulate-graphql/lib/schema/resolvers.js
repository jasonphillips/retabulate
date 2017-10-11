'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3A = require('d3-array');
var d3C = require('d3-collection');

console.log('AAA');

var CollectionMap = function () {
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

var groupBy = function groupBy(rows, col) {
  return d3C.nest().key(function (row) {
    return row[col];
  }).object(rows);
};
//.reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

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
  }).object(data);
};
//.reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

var _distributionRatio = function _distributionRatio(data) {
  return d3C.nest().key(function (d) {
    return d;
  }).rollup(function (v) {
    return v.length / data.length;
  }).object(data);
};
//.reduce((all, {key, value}) => Object.assign(all, {[key]: value}), {});

var concat = function concat(arr, val) {
  return val ? arr.concat([val]) : arr;
};

var addFilters = function addFilters(objA, key, values) {
  return _extends({}, objA, _defineProperty({}, key, objA[key] ? (objA[key].map ? objA[key] : [objA[key]]).concat(values) : values));
};

var generateLeaf = function generateLeaf(data, context) {
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
    table: function table(root, _ref, context) {
      var set = _ref.set,
          where = _ref.where;

      return new Promise(function (resolve, reject) {
        context.getDataset(set).then(function (data) {

          if (!data) {
            throw new Error('dataset ' + set + ' not found');
          }

          var collection = new CollectionMap(data);
          context.tabulate = { iterator: 0 };

          if (where) collection = collection.filterAny(where.reduce(function (all, _ref2) {
            var key = _ref2.key,
                values = _ref2.values;
            return _extends({}, all, _defineProperty({}, key, values));
          }, {}));

          resolve({
            _rows: collection,
            _query: {}, _grid: {}, _renderIds: [], _transposes: {}, _detransposes: {}, _exclude: {}, _aggIndex: 0 });
        });
      });
    }
  },
  Table: {
    length: function length(_ref3) {
      var _rows = _ref3._rows;
      return _rows.length;
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
  },
  Axis: {
    label: function label(_ref5) {
      var key = _ref5.key;
      return key;
    },
    length: function length(_ref6) {
      var _rows = _ref6._rows;
      return _rows.length;
    },
    classes: function classes(data, _ref7) {
      var key = _ref7.key,
          all = _ref7.all,
          total = _ref7.total,
          orderBy = _ref7.orderBy,
          renderId = _ref7.renderId,
          mapping = _ref7.mapping,
          ordering = _ref7.ordering;

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
        value = mapping.map(function (_ref8) {
          var label = _ref8.label,
              values = _ref8.values;


          var basics = _extends({}, data, {
            key: label,
            _aggIndex: data._aggIndex,
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });

          if (values) {
            var rows = groups.keys(values);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var val = _step2.value;
                allGroups[val] = false;
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
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
            _renderIds: concat(data._renderIds, renderId),
            renderId: renderId
          });
        });
      }

      // apply optional ordering by another column
      if (orderBy) value = _lodash2.default.sortBy(value, function (v) {
        return v._rows.data[0][orderBy];
      });

      // add in the total group if all / total requested
      if (all || total) value.push(_extends({}, data, { key: all, _aggIndex: data._aggIndex, renderIds: concat(data._renderIds, renderId), renderId: renderId }));

      return value;
    },
    transpose: function transpose(data, _ref9) {
      var keys = _ref9.keys,
          asKey = _ref9.asKey,
          renderId = _ref9.renderId;

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
    all: function all(data, _ref10) {
      var label = _ref10.label,
          renderId = _ref10.renderId;
      return _extends({}, data, {
        label: label, key: label,
        renderId: renderId, _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
      });
    },
    renderIds: function renderIds(_ref11) {
      var _renderIds = _ref11._renderIds;
      return _renderIds;
    },
    node: function node(data) {
      return data;
    },
    leaf: function leaf(data, args, context) {
      return generateLeaf(data, context);
    },
    variable: function variable(data, _ref12) {
      var key = _ref12.key,
          keys = _ref12.keys,
          renderId = _ref12.renderId;
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
    value: function value(data, _ref13) {
      var _value2 = _ref13.value,
          values = _ref13.values,
          renderId = _ref13.renderId;
      return _extends({}, data, { _value: _value2 || values, _renderIds: concat(data._renderIds, renderId)
      });
    },
    aggregation: function aggregation(data, _ref14) {
      var method = _ref14.method,
          methods = _ref14.methods,
          diff = _ref14.diff,
          over = _ref14.over,
          renderId = _ref14.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    statistic: function statistic(data, _ref15) {
      var method = _ref15.method,
          methods = _ref15.methods,
          diff = _ref15.diff,
          over = _ref15.over,
          renderId = _ref15.renderId;
      return _extends({}, data, { _agg: method || methods, _over: over, _diff: diff, method: method, _renderIds: concat(data._renderIds, renderId)
      });
    },
    all: function all(data, _ref16) {
      var label = _ref16.label,
          renderId = _ref16.renderId;
      return _extends({}, data, {
        renderId: renderId,
        label: label,
        _renderIds: concat(data._renderIds, renderId),
        _aggIndex: data._aggIndex + 1
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
  },
  Cell: {
    value: function value(_ref19, _ref20) {
      var query = _ref19.query,
          detransposes = _ref19.detransposes,
          variable = _ref19.variable,
          agg = _ref19.agg,
          diff = _ref19.diff,
          diffOver = _ref19.diffOver,
          over = _ref19.over,
          rows = _ref19.rows,
          fmt = _ref19.fmt;
      var missing = _ref20.missing;

      return JSON.stringify(diff
      // if diff: calculate this group, diff group
      ? {
        group: applyAggregations(agg)(rows, detransposes[variable] || variable, over),
        diff: applyAggregations(agg)(diff, detransposes[variable] || variable, diffOver)
      } : applyAggregations(agg, diff, diffOver)(rows, detransposes[variable] || variable, over));
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