'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TableWithFragment = exports.Statistic = exports.Value = exports.Variable = exports.Transpose = exports.Header = exports.All = exports.Axis = exports.Filter = exports.Expand = exports.Tabulation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
/*
    this is an alternate export, built for creating graphql fragments
    instead of connecting directly to an apollo client, so that you
    may include that manually in your own higher-level queries
*/

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TabulationFragments = require('./components/TabulationFragments');

var _TabulationFragments2 = _interopRequireDefault(_TabulationFragments);

var _Expand = require('./components/Expand');

var _Expand2 = _interopRequireDefault(_Expand);

var _Filter = require('./components/Filter');

var _Filter2 = _interopRequireDefault(_Filter);

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

// allows grabbing the fragment from a component having a Tabulation as first child
var TableWithFragment = function TableWithFragment(component) {
    if (!component.type || !component.type.getFragment) throw new Error('TableWithFragment should have a Tabulation as child');

    var fragment = component.type.getFragment(component.props);
    return {
        fragment: fragment,
        Component: function Component(props) {
            return _react2.default.cloneElement(component, _extends({}, component.props, { props: props }));
        }
    };
};

exports.Tabulation = _TabulationFragments2.default;
exports.Expand = _Expand2.default;
exports.Filter = _Filter2.default;
exports.Axis = _Axis2.default;
exports.All = _All2.default;
exports.Header = Header;
exports.Transpose = _Transpose2.default;
exports.Variable = _Variable2.default;
exports.Value = _Value2.default;
exports.Statistic = _Statistic2.default;
exports.TableWithFragment = TableWithFragment;