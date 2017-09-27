'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Statistic = exports.Value = exports.Variable = exports.Transpose = exports.Header = exports.All = exports.Axis = exports.Expand = exports.RetabulateProvider = exports.Tabulation = undefined;

var _Tabulation = require('./components/Tabulation');

var _Tabulation2 = _interopRequireDefault(_Tabulation);

var _RetabulateProvider = require('./components/RetabulateProvider');

var _RetabulateProvider2 = _interopRequireDefault(_RetabulateProvider);

var _Expand = require('./components/Expand');

var _Expand2 = _interopRequireDefault(_Expand);

var _All = require('./components/All');

var _All2 = _interopRequireDefault(_All);

var _Transpose = require('./components/Transpose');

var _Transpose2 = _interopRequireDefault(_Transpose);

var _Axis = require('./components/Axis');

var _Axis2 = _interopRequireDefault(_Axis);

var _Variable = require('./components/Variable');

var _Variable2 = _interopRequireDefault(_Variable);

var _Value = require('./components/Value');

var _Value2 = _interopRequireDefault(_Value);

var _Statistic = require('./components/Statistic');

var _Statistic2 = _interopRequireDefault(_Statistic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// alias
var Header = _All2.default;

exports.Tabulation = _Tabulation2.default;
exports.RetabulateProvider = _RetabulateProvider2.default;
exports.Expand = _Expand2.default;
exports.Axis = _Axis2.default;
exports.All = _All2.default;
exports.Header = Header;
exports.Transpose = _Transpose2.default;
exports.Variable = _Variable2.default;
exports.Value = _Value2.default;
exports.Statistic = _Statistic2.default;