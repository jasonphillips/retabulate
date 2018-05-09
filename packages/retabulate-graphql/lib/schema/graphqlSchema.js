'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootType = exports.tableField = undefined;

var _graphql = require('graphql');

var _Table = require('./types/Table');

var _Table2 = _interopRequireDefault(_Table);

var _inputTypes = require('./types/inputTypes');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  A field for including / stitching to other schemas
*/

const tableField = exports.tableField = {
  type: _Table2.default,
  args: {
    set: { type: _graphql.GraphQLString },
    queryId: { type: _graphql.GraphQLString },
    where: { type: new _graphql.GraphQLList(_inputTypes.ConditionType) }
  },
  resolve: (root, { set, where, queryId }, context) => {
    // get the dataset and begin
    return new Promise((resolve, reject) => context.getDataset(set, queryId).then(data => {
      if (!data) {
        throw new Error(`dataset ${set} not found`);
      }

      let collection = new _helpers.CollectionMap(data);
      context.tabulate = { iterator: 0 };

      if (where) collection = collection.filterAny(where.reduce((all, { key, values }) => Object.assign({}, all, { [key]: values }), {}));

      resolve({
        _rows: collection,
        _query: {},
        _grid: {},
        _renderIds: [],
        _transposes: {},
        _detransposes: {},
        _exclude: {},
        _aggIndex: 0
      });
    }));
  }
};

const RootType = exports.RootType = new _graphql.GraphQLObjectType({
  name: 'RootType',
  fields: {
    table: tableField
  }
});

const schema = new _graphql.GraphQLSchema({
  query: RootType
});

exports.default = schema;