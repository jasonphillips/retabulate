'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QueryClosure = require('../classes/QueryClosure');

var _QueryClosure2 = _interopRequireDefault(_QueryClosure);

var _gatherChildConfig = require('../utils/gatherChildConfig');

var _gatherChildConfig2 = _interopRequireDefault(_gatherChildConfig);

var _makeRenderers2 = require('../utils/makeRenderers');

var _makeRenderers3 = _interopRequireDefault(_makeRenderers2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transpose = function (_React$Component) {
  _inherits(Transpose, _React$Component);

  function Transpose() {
    _classCallCheck(this, Transpose);

    return _possibleConstructorReturn(this, (Transpose.__proto__ || Object.getPrototypeOf(Transpose)).apply(this, arguments));
  }

  _createClass(Transpose, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('span', null);
    }
  }], [{
    key: 'serialize',
    value: function serialize(props, index, context) {
      var columns = props.columns,
          as = props.as,
          label = props.label,
          total = props.total,
          cellProps = props.cellProps,
          cellStyles = props.cellStyles,
          labelRenderer = props.labelRenderer,
          labelProps = props.labelProps,
          labelStyles = props.labelStyles,
          children = props.children;

      var _makeRenderers = (0, _makeRenderers3.default)({
        cellProps: cellProps, cellStyles: cellStyles, labelRenderer: labelRenderer, labelProps: labelProps, labelStyles: labelStyles
      }, context),
          renderId = _makeRenderers.renderId,
          renderers = _makeRenderers.renderers;

      var Query = new _QueryClosure2.default('transpose', columns, label ? renderId : '__' + index, renderId, { asKey: as });
      var descendents = (0, _gatherChildConfig2.default)(children, context);

      if (descendents.query) {
        Query.inject(descendents.query);
      }

      return {
        query: Query,
        renderers: _extends({}, renderers, descendents.renderers),
        labels: _extends(_defineProperty({}, '_' + renderId, label), descendents.labels)
      };
    }
  }]);

  return Transpose;
}(_react2.default.Component);

exports.default = Transpose;