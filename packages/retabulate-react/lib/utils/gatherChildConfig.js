'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.callChildSerializers = undefined;

var _react = require('react');

var callChildSerializers = exports.callChildSerializers = function callChildSerializers(children, context) {
    if (!children) return [];

    var childs = children.map ? children : children ? [children] : [];
    // call serialize() method of all children
    return _react.Children.toArray(childs).map(function (child, index) {
        return child.type.serialize(child.props, index, context);
    });
};

var gatherChildConfig = function gatherChildConfig(children, context) {
    return callChildSerializers(children, context).reduce(function (combined, _ref) {
        var query = _ref.query,
            renderers = _ref.renderers,
            labels = _ref.labels;
        return {
            // assemble children siblings horizontally
            query: combined.query ? combined.query.push(query) : query,
            // merge renderer maps
            renderers: Object.assign(combined.renderers, renderers),
            // merge label maps
            labels: Object.assign(combined.labels, labels)
        };
    }, { query: null, renderers: {}, labels: {} });
};

exports.default = gatherChildConfig;