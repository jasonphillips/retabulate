'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableField = exports.makeNetworkInterface = exports.makeLocalExecution = undefined;

var _graphqlSchema = require('./schema/graphqlSchema');

var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);

var _local = require('./local');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.makeLocalExecution = _local.makeLocalExecution;
exports.makeNetworkInterface = _local.makeNetworkInterface;
exports.tableField = _graphqlSchema.tableField;
exports.default = _graphqlSchema2.default;