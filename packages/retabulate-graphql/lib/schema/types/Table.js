'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Axis = require('./Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Row = require('./Row');

var _Row2 = _interopRequireDefault(_Row);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TableType = new _graphql.GraphQLObjectType({
  name: 'TableType',
  fields: {
    top: {
      type: _Axis2.default,
      resolve: (data, args) => Object.assign({}, data, { key: null, _axis: 'x' })
    },
    left: {
      type: _Axis2.default,
      resolve: (data, args) => Object.assign({}, data, { key: null, _axis: 'y' })
    },
    length: {
      type: _graphql.GraphQLInt,
      resolve: ({ _rows }) => _rows.length
    },
    rows: {
      type: new _graphql.GraphQLList(_Row2.default),
      resolve: ({ _rows, _grid }) => new Promise(
      // the nextTick() hack is used to ensure Left / Right
      // axes have been processed prior to this execution
      (resolve, rej) => process.nextTick(() => {
        resolve(_grid.y.sort((a, b) => a.id > b.id ? 1 : -1).map(y => Object.assign({}, y, {
          _grid,
          _rows: _rows,
          _all: _rows
        })));
      }))
    }
  }
});

exports.default = TableType;