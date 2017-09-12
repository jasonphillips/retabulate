'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gatherChildConfig = require('../utils/gatherChildConfig');

var _gatherChildConfig2 = _interopRequireDefault(_gatherChildConfig);

var _makeRenderers = require('../utils/makeRenderers');

var _makeRenderers2 = _interopRequireDefault(_makeRenderers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Axis = function (_React$Component) {
  _inherits(Axis, _React$Component);

  function Axis() {
    _classCallCheck(this, Axis);

    return _possibleConstructorReturn(this, (Axis.__proto__ || Object.getPrototypeOf(Axis)).apply(this, arguments));
  }

  _createClass(Axis, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('span', null);
    }
  }], [{
    key: 'serialize',
    value: function serialize(props, index, context) {
      var position = props.position,
          children = props.children;


      var descendents = (0, _gatherChildConfig2.default)(children, context);

      return {
        queryFragment: position + ' { ' + descendents.query.toString() + ' }',
        renderers: descendents.renderers,
        labels: descendents.labels
      };
    }
  }]);

  return Axis;
}(_react2.default.Component);

exports.default = Axis;