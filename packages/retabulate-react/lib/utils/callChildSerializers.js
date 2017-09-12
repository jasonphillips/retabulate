"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var callChildSerializers = function callChildSerializers(children) {
    if (!children) return;

    var childs = children.map ? children : [children];
    // call serialize() method of all children
    return childs.map(function (child, index) {
        return child.type.serialize(child.props, index);
    });
};

exports.default = callChildSerializers;