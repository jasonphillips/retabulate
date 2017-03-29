'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeLocalExecution = undefined;

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _local = require('./local');

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.makeLocalExecution = _local2.default;
exports.default = _schema2.default;