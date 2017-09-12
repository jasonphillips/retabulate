'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _generateHash = require('./generateHash');

var _generateHash2 = _interopRequireDefault(_generateHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var makeRenderers = function makeRenderers(props, context) {
    var _renderers;

    context.iterator++;
    var renderId = 'r' + context.iterator;

    var renderProps = {
        // default: pass through unchanged
        props: function props(pre) {
            return pre;
        },
        styles: function styles(pre) {
            return pre;
        }
    };

    var renderLabelProps = {
        // default: pass through unchanged
        props: function props(pre) {
            return pre;
        },
        styles: function styles(pre) {
            return pre;
        }
    };

    if (props.cellProps) {
        if (typeof props.cellProps === 'function') {
            renderProps.props = function (pre) {
                return _extends({}, pre, props.cellProps(pre));
            };
        } else {
            renderProps.props = function (pre) {
                return _extends({}, pre, props.cellProps);
            };
        }
    }

    if (props.formatter) {
        var inner = renderProps.props;
        renderProps.props = function (pre) {
            return _extends({}, inner(pre), {
                value: props.formatter(pre.value)
            });
        };
    }

    if (props.cellStyles) {
        if (typeof props.cellStyles === 'function') {
            renderProps.styles = function (pre) {
                return _extends({}, pre, props.cellStyles(pre));
            };
        } else {
            renderProps.styles = function (pre) {
                return _extends({}, pre, props.cellStyles);
            };
        }
    }

    if (props.cellRenderer) {
        renderProps.cellRenderer = props.cellRenderer;
    }

    // label formatters

    if (props.labelProps) {
        if (typeof props.labelProps === 'function') {
            renderLabelProps.props = function (pre) {
                return _extends({}, pre, props.labelProps(pre));
            };
        } else {
            renderLabelProps.props = function (pre) {
                return _extends({}, pre, props.labelProps);
            };
        }
    }

    if (props.labelStyles) {
        if (typeof props.labelStyles === 'function') {
            renderLabelProps.styles = function (pre) {
                return _extends({}, pre, props.labelStyles(pre));
            };
        } else {
            renderLabelProps.styles = function (pre) {
                return _extends({}, pre, props.labelStyles);
            };
        }
    }

    if (props.labelRenderer) {
        renderLabelProps.labelRenderer = props.labelRenderer;
    }

    return {
        renderId: renderId,
        renderers: (_renderers = {}, _defineProperty(_renderers, renderId, renderProps), _defineProperty(_renderers, '_' + renderId, renderLabelProps), _renderers)
    };
};

exports.default = makeRenderers;