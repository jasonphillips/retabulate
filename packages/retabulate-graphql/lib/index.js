'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeNetworkInterface = exports.makeLocalExecution = undefined;

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _local = require('./local');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.makeLocalExecution = _local.makeLocalExecution;
exports.makeNetworkInterface = _local.makeNetworkInterface;
exports.default = _schema2.default;