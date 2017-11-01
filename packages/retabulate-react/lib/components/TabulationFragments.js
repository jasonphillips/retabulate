'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _retabulateReactRenderer = require('retabulate-react-renderer');

var _retabulateReactRenderer2 = _interopRequireDefault(_retabulateReactRenderer);

var _QueryClosure = require('../classes/QueryClosure');

var _gatherChildConfig = require('../utils/gatherChildConfig');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fragmentTemplate = function fragmentTemplate(rootType, name, dataset, where, axes) {
  return '\n  fragment ' + name + 'Fragment on ' + rootType + ' {\n    ' + name + ': table(set:"' + dataset + '" ' + where + ') {\n      ' + axes + '\n      rows {\n        cells {\n          value colID rowID variable agg renderIds\n          queries { key value }\n        }\n      }\n    }\n  }\n';
};

var Tabulation = function (_React$Component) {
  _inherits(Tabulation, _React$Component);

  function Tabulation(props, context) {
    _classCallCheck(this, Tabulation);

    var _this = _possibleConstructorReturn(this, (Tabulation.__proto__ || Object.getPrototypeOf(Tabulation)).call(this, props));

    var _Tabulation$getRender = Tabulation.getRenderers(props),
        renderers = _Tabulation$getRender.renderers,
        labels = _Tabulation$getRender.labels;

    _this.state = {
      renderers: renderers || {},
      labels: labels || {}
    };
    return _this;
  }

  _createClass(Tabulation, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.watchedProps) {
        var changed = Object.keys(this.props.watchedProps).reduce(function (should, prop) {
          return _this2.props.watchedProps[prop] !== nextProps.watchedProps[prop] ? true : should;
        }, false);
        if (changed) {
          var _Tabulation$getRender2 = Tabulation.getRenderers(nextProps),
              renderers = _Tabulation$getRender2.renderers,
              labels = _Tabulation$getRender2.labels;

          this.setState({ renderers: renderers, labels: labels });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          renderers = _state.renderers,
          labels = _state.labels;
      var _props = this.props,
          className = _props.className,
          tabs = _props.tabs,
          data = _props.data,
          placeholder = _props.placeholder,
          cellRenderer = _props.cellRenderer,
          name = _props.name,
          config = _props.config,
          watchedProps = _props.watchedProps;

      var rootPath = config ? config.rootType : '';

      if (!data && !tabs) return placeholder ? _react2.default.createElement(placeholder, {}) : _react2.default.createElement('div', null);

      var tableData = tabs ? Tabulation.getData(tabs, name, rootPath) : Tabulation.getData(data);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_retabulateReactRenderer2.default, {
          tabulated: tableData,
          renderers: _extends({}, renderers, { cellRenderer: cellRenderer }),
          labels: labels,
          pending: false,
          watchedProps: watchedProps,
          className: className
        })
      );
    }
  }], [{
    key: 'getRenderers',
    value: function getRenderers(props) {
      var dataset = props.dataset,
          where = props.where,
          children = props.children,
          name = props.name,
          config = props.config;


      var axes = (0, _gatherChildConfig.callChildSerializers)(children, { iterator: 0 });
      var renderers = axes.reduce(function (r, a) {
        return _extends({}, r, a.renderers);
      }, {});
      var labels = axes.reduce(function (r, a) {
        return _extends({}, r, a.labels);
      }, {});

      return { renderers: renderers, labels: labels };
    }
  }, {
    key: 'getFragment',
    value: function getFragment(props) {
      var dataset = props.dataset,
          where = props.where,
          children = props.children,
          name = props.name,
          config = props.config;

      var rootType = config ? config.rootType : '';

      var axes = (0, _gatherChildConfig.callChildSerializers)(children, { iterator: 0 });

      // if where conditions
      var whereArg = where ? 'where: [' + where.map(function (condition) {
        return (0, _QueryClosure.toGqlObjectArg)(condition);
      }) + ']' : '';

      return fragmentTemplate(rootType, name, dataset, whereArg, axes.map(function (a) {
        return a.queryFragment;
      }).join(' '));
    }
  }, {
    key: 'getData',
    value: function getData(source, tableName, rootPath) {
      // in some context, stringifying first is prudential
      var parsedSource = typeof source === 'string' ? JSON.parse(source) : source;
      if (!tableName) return parsedSource;
      return (0, _lodash2.default)(parsedSource, rootPath.map ? rootPath.concat([tableName]) : rootPath + tableName);
    }
  }]);

  return Tabulation;
}(_react2.default.Component);

exports.default = Tabulation;