'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n    query tabulate {\n        table(set:"', '") {\n            ', '\n            rows {\n              cells {\n                value\n                colID\n                rowID\n                variable\n                agg\n                queries {\n                key\n                value\n                }\n              }\n            }\n        }\n    }\n'], ['\n    query tabulate {\n        table(set:"', '") {\n            ', '\n            rows {\n              cells {\n                value\n                colID\n                rowID\n                variable\n                agg\n                queries {\n                key\n                value\n                }\n              }\n            }\n        }\n    }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _retabulateReactRenderer = require('retabulate-react-renderer');

var _retabulateReactRenderer2 = _interopRequireDefault(_retabulateReactRenderer);

var _callChildSerializers = require('../utils/callChildSerializers');

var _callChildSerializers2 = _interopRequireDefault(_callChildSerializers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var queryTemplate = function queryTemplate(dataset, axes) {
    return (0, _graphqlTag2.default)(_templateObject, dataset, axes);
};

var Retabulate = function (_React$Component) {
    _inherits(Retabulate, _React$Component);

    function Retabulate(props, context) {
        _classCallCheck(this, Retabulate);

        var _this = _possibleConstructorReturn(this, (Retabulate.__proto__ || Object.getPrototypeOf(Retabulate)).call(this, props));

        _this.startQuery = _this.startQuery.bind(_this);
        _this.client = context.RetabulateClient;

        var query = _this.getQuery(props);
        _this.startQuery(query);

        _this.state = {
            pending: true, data: null
        };
        return _this;
    }

    _createClass(Retabulate, [{
        key: 'getQuery',
        value: function getQuery(props) {
            var dataset = props.dataset,
                children = props.children;

            var axes = (0, _callChildSerializers2.default)(children).join(' ');

            return queryTemplate(dataset, axes);
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
                pending = _state.pending;
            var cellRenderer = this.props.cellRenderer;


            return _react2.default.createElement(
                'div',
                null,
                !pending && _react2.default.createElement(_retabulateReactRenderer2.default, { tabulated: data.data.table, cellRenderer: cellRenderer }),
                _react2.default.createElement(
                    'pre',
                    null,
                    JSON.stringify(this.state, null, 2)
                )
            );
        }
    }]);

    return Retabulate;
}(_react2.default.Component);

Retabulate.contextTypes = {
    RetabulateClient: _propTypes2.default.object
};

exports.default = Retabulate;