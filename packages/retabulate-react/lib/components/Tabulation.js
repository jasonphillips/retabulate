'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    query tabulate {\n        table(set:"', '") {\n            ', '\n            rows {\n              cells {\n                value colID rowID variable agg renderIds\n                queries { key value }\n              }\n            }\n        }\n    }\n'], ['\n    query tabulate {\n        table(set:"', '") {\n            ', '\n            rows {\n              cells {\n                value colID rowID variable agg renderIds\n                queries { key value }\n              }\n            }\n        }\n    }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _retabulateReactRenderer = require('retabulate-react-renderer');

var _retabulateReactRenderer2 = _interopRequireDefault(_retabulateReactRenderer);

var _gatherChildConfig = require('../utils/gatherChildConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var queryTemplate = function queryTemplate(dataset, axes) {
    return (0, _graphqlTag2.default)(_templateObject, dataset, axes);
};

var Tabulation = function (_React$Component) {
    _inherits(Tabulation, _React$Component);

    function Tabulation(props, context) {
        _classCallCheck(this, Tabulation);

        var _this = _possibleConstructorReturn(this, (Tabulation.__proto__ || Object.getPrototypeOf(Tabulation)).call(this, props));

        _this.startQuery = _this.startQuery.bind(_this);
        _this.client = context.RetabulateClient;

        var _this$getQuery = _this.getQuery(props),
            query = _this$getQuery.query,
            renderers = _this$getQuery.renderers,
            labels = _this$getQuery.labels;

        _this.startQuery(query);

        _this.state = {
            pending: true,
            data: null,
            renderers: renderers || {},
            labels: labels || {}
        };
        return _this;
    }

    _createClass(Tabulation, [{
        key: 'getQuery',
        value: function getQuery(props) {
            var dataset = props.dataset,
                children = props.children;

            var axes = (0, _gatherChildConfig.callChildSerializers)(children, { iterator: 0 });
            var renderers = axes.reduce(function (r, a) {
                return _extends({}, r, a.renderers);
            }, {});
            var labels = axes.reduce(function (r, a) {
                return _extends({}, r, a.labels);
            }, {});

            return {
                query: queryTemplate(dataset, axes.map(function (a) {
                    return a.queryFragment;
                }).join(' ')),
                renderers: renderers,
                labels: labels
            };
        }
    }, {
        key: 'startQuery',
        value: function startQuery(query) {
            var _this2 = this;

            this.client.query({ query: query }).then(function (data) {
                return _this2.setState({ data: data, pending: false });
            }).catch(console.error);
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                data = _state.data,
                pending = _state.pending,
                renderers = _state.renderers,
                labels = _state.labels;
            var cellRenderer = this.props.cellRenderer;


            return _react2.default.createElement(
                'div',
                null,
                !pending && _react2.default.createElement(_retabulateReactRenderer2.default, {
                    tabulated: data.data.table,
                    renderers: _extends({}, renderers, { cellRenderer: cellRenderer }),
                    labels: labels
                })
            );
        }
    }]);

    return Tabulation;
}(_react2.default.Component);

Tabulation.contextTypes = {
    RetabulateClient: _propTypes2.default.object
};

exports.default = Tabulation;