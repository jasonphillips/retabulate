'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// converts cells to a collection to be used in charts, etc
var WrapRenderer = function WrapRenderer(_ref) {
  var data = _ref.data,
      renderer = _ref.renderer;

  var cells = data.rows.map(function (r) {
    return r.cells;
  }).reduce(function (all, a) {
    return all.concat(a);
  }, []);

  var collection = cells.map(function (c) {
    return _extends({}, c.queries.reduce(function (combined, _ref2) {
      var key = _ref2.key,
          values = _ref2.values;
      return _extends({}, combined, _defineProperty({}, key, values));
    }, {}), {
      value: JSON.parse(c.value),
      agg: c.agg,
      variable: c.variable
    });
  });

  return _react2.default.createElement(renderer, { data: collection });
};

exports.default = WrapRenderer;