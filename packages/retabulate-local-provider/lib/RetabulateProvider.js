'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _apolloClient = require('apollo-client');

var _apolloCacheInmemory = require('apollo-cache-inmemory');

var _apolloLinkSchema = require('apollo-link-schema');

var _retabulateGraphql = require('retabulate-graphql');

var _retabulateGraphql2 = _interopRequireDefault(_retabulateGraphql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RetabulateProvider = function (_React$Component) {
  _inherits(RetabulateProvider, _React$Component);

  function RetabulateProvider(props) {
    _classCallCheck(this, RetabulateProvider);

    var _this = _possibleConstructorReturn(this, (RetabulateProvider.__proto__ || Object.getPrototypeOf(RetabulateProvider)).call(this, props));

    var getDataset = props.getDataset;


    _this.client = new _apolloClient.ApolloClient({
      cache: new _apolloCacheInmemory.InMemoryCache(),
      link: new _apolloLinkSchema.SchemaLink({ schema: _retabulateGraphql2.default, context: { getDataset: getDataset } })
    });
    return _this;
  }

  _createClass(RetabulateProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { RetabulateClient: this.client };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return RetabulateProvider;
}(_react2.default.Component);

RetabulateProvider.childContextTypes = {
  RetabulateClient: _propTypes2.default.object
};

exports.default = RetabulateProvider;