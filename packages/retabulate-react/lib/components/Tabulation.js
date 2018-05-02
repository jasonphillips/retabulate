'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    query tabulate {\n        ', '\n        ', ' table(set:"', '" ', ') {\n            ', '\n            rows {\n              cells {\n                value colID rowID variable detransposed agg renderIds\n                queries { key values }\n              }\n            }\n        }\n        ', '\n    }\n'], ['\n    query tabulate {\n        ', '\n        ', ' table(set:"', '" ', ') {\n            ', '\n            rows {\n              cells {\n                value colID rowID variable detransposed agg renderIds\n                queries { key values }\n              }\n            }\n        }\n        ', '\n    }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _retabulateReactRenderer = require('retabulate-react-renderer');

var _retabulateReactRenderer2 = _interopRequireDefault(_retabulateReactRenderer);

var _WrapRenderer = require('./WrapRenderer');

var _WrapRenderer2 = _interopRequireDefault(_WrapRenderer);

var _QueryClosure = require('../classes/QueryClosure');

var _gatherChildConfig = require('../utils/gatherChildConfig');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var queryTemplate = function queryTemplate(dataset, where, axes, queryPrefix, tableName) {
    return (0, _graphqlTag2.default)(_templateObject, queryPrefix.concat([null]).join(' { '), tableName ? tableName + ':' : '', dataset, where, axes, queryPrefix.map(function (p) {
        return '}';
    }).join(' '));
};

var Tabulation = function (_React$Component) {
    _inherits(Tabulation, _React$Component);

    function Tabulation(props, context) {
        _classCallCheck(this, Tabulation);

        var _this = _possibleConstructorReturn(this, (Tabulation.__proto__ || Object.getPrototypeOf(Tabulation)).call(this, props));

        _this.startQuery = _this.startQuery.bind(_this);
        _this.updateQuery = _this.updateQuery.bind(_this);
        _this.client = context.RetabulateClient;
        _this.queryPrefix = context.RetabulateQueryPrefix;

        var _this$getQuery = _this.getQuery(props),
            query = _this$getQuery.query,
            renderers = _this$getQuery.renderers,
            labels = _this$getQuery.labels;

        _this.state = {
            pending: true,
            data: null,
            renderers: renderers || {},
            labels: labels || {}
        };

        _this.startQuery(query).then(function (data) {
            return _this.setState({ data: data, pending: false });
        });
        return _this;
    }

    _createClass(Tabulation, [{
        key: 'updateQuery',
        value: function updateQuery(props) {
            var _this2 = this;

            var _getQuery = this.getQuery(props),
                query = _getQuery.query,
                renderers = _getQuery.renderers,
                labels = _getQuery.labels;

            this.setState({ pending: true });

            this.startQuery(query).then(function (data) {
                return _this2.setState({
                    data: data,
                    pending: false,
                    renderers: renderers || {},
                    labels: labels || {}
                });
            });

            return true;
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.props.collectionRenderer) return true;
            // network pending status or data object change
            if (nextState.pending !== this.state.pending || nextState.data !== this.state.data) return true;

            return false;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this3 = this;

            // watched props: dataset / where
            if (nextProps.dataset !== this.props.dataset || JSON.stringify(nextProps.where) != JSON.stringify(this.props.where)) this.updateQuery(nextProps);
            // user-defined watched props
            if (this.props.watchedProps) {
                var changed = Object.keys(this.props.watchedProps).reduce(function (should, prop) {
                    return _this3.props.watchedProps[prop] !== nextProps.watchedProps[prop] ? true : should;
                }, false);
                if (changed) this.updateQuery(nextProps);
            }
        }
    }, {
        key: 'getQuery',
        value: function getQuery(props) {
            var dataset = props.dataset,
                where = props.where,
                name = props.name,
                children = props.children;

            var axes = (0, _gatherChildConfig.callChildSerializers)(children, { iterator: 0 });
            var renderers = axes.reduce(function (r, a) {
                return _extends({}, r, a.renderers);
            }, {});
            var labels = axes.reduce(function (r, a) {
                return _extends({}, r, a.labels);
            }, {});

            // if where conditions
            var whereArg = where ? 'where: [' + where.map(function (condition) {
                return (0, _QueryClosure.toGqlObjectArg)(condition);
            }) + ']' : '';

            return {
                query: queryTemplate(dataset, whereArg, axes.map(function (a) {
                    return a.queryFragment;
                }).join(' '), this.queryPrefix || [], name),
                renderers: renderers,
                labels: labels
            };
        }
    }, {
        key: 'startQuery',
        value: function startQuery(query) {
            var _this4 = this;

            if (typeof this.props.queryLogger === 'function') this.props.queryLogger('query', query);

            return new Promise(function (res, rej) {
                return _this4.client.query({ query: query, fetchPolicy: 'network-only' }).then(function (data) {
                    if (typeof _this4.props.queryLogger === 'function') {
                        _this4.props.queryLogger('data', data);
                    }
                    res(data);
                }).catch(console.error);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                data = _state.data,
                pending = _state.pending,
                renderers = _state.renderers,
                labels = _state.labels;
            var _props = this.props,
                cellRenderer = _props.cellRenderer,
                className = _props.className,
                name = _props.name,
                collectionRenderer = _props.collectionRenderer;

            var tableData = (0, _lodash2.default)(data, ['data'].concat(_toConsumableArray(this.queryPrefix.map(function (q) {
                return q.replace(/\(.*?\)/, '');
            })), [name || 'table']));

            return _react2.default.createElement(
                'div',
                null,
                tableData && (collectionRenderer ? _react2.default.createElement(_WrapRenderer2.default, { renderer: collectionRenderer, data: tableData }) : _react2.default.createElement(_retabulateReactRenderer2.default, {
                    tabulated: tableData,
                    renderers: _extends({}, renderers, { cellRenderer: cellRenderer }),
                    labels: labels,
                    pending: pending,
                    className: className
                }))
            );
        }
    }]);

    return Tabulation;
}(_react2.default.Component);

Tabulation.contextTypes = {
    RetabulateClient: _propTypes2.default.object,
    RetabulateQueryPrefix: _propTypes2.default.array
};

exports.default = Tabulation;