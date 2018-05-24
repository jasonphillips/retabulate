'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RowType = new _graphql.GraphQLObjectType({
  name: 'RowType',
  description: 'Represents a row of cells in the data portion of table',
  fields: {
    length: {
      description: 'Number of cells in this row',
      type: _graphql.GraphQLInt,
      resolve: ({ _grid }) => _grid.x.length
    },
    cells: {
      description: 'Ordered cells in row with data',
      type: new _graphql.GraphQLList(_Cell2.default),
      resolve: (y, args) => y._grid.x.map(x => {
        const detransposes = Object.assign({}, x.detransposes, y.detransposes);
        const variable = y.variable || x.variable || null;
        const value = y.value || x.value || null;

        let query = Object.assign({}, y.query, x.query);
        let diffDetransposes;
        let diffRows;
        let diffOver;

        if (variable && value !== null) {
          query = Object.assign({}, query, { [detransposes[variable] || variable]: value });
        }

        const agg = y.agg || x.agg || 'n';
        const over = detransposes[y.over] || y.over || detransposes[x.over] || x.over || null;
        const overQuery = over ? (0, _helpers.omit)(query, [over]) : null;

        const rows = y._rows.filterAny(query);

        if (y.diff || x.diff) {
          const diff = x.diff || y.diff;

          if (detransposes[diff.key]) {
            diffDetransposes = Object.assign({}, detransposes, { [diff.key]: diff.values[0] });
            diffRows = rows;
          } else {
            diffRows = y._all.filterAny((0, _helpers.omit)(query, [diff.key]));
            diffOver = y._all.filterAny((0, _helpers.omit)(query, [diff.key, over]));

            if (diff.values) {
              diffRows = diffRows.filterAny({ [diff.key]: diff.values });
              diffOver = diffOver.filterAny({ [diff.key]: diff.values });
            }
          }
        }

        return {
          query: query,
          variable,
          agg: agg,
          detransposes: detransposes,
          diffDetransposes: diffDetransposes ? diffDetransposes : detransposes,
          colID: x.id,
          rowID: y.id,
          rows: x.redacted || y.redacted ? [] : rows.data,
          over: over ? y._all.filterAny(overQuery).data : null,
          diff: diffRows ? diffRows.data : null,
          diffOver: diffOver ? diffOver.data : null,
          redacted: x.redacted || y.redacted,
          fmt: y.fmt || x.fmt || '',
          renderIds: x.renderIds.concat(y.renderIds)
        };
      })
    }
  }
});

exports.default = RowType;