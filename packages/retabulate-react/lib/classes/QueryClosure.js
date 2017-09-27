'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// serialize obj {"key": "value", "another": "value"} to gql {key: "value", another: "value"}
// -- quotes around keys (normal JSON stringify) are rejected in gql args
var toGqlObjectArg = exports.toGqlObjectArg = function toGqlObjectArg(obj) {
    return '{' + Object.keys(obj).map(function (k) {
        return k + ': ' + JSON.stringify(obj[k]);
    }) + '}';
};

var QueryClosure = function () {
    function QueryClosure(type, key, label, renderId, args) {
        var _this = this;

        _classCallCheck(this, QueryClosure);

        this.type = type;
        this.label = label;
        this.key = key;
        this.renderId = renderId;

        this.child = null;
        this.siblings = [];

        if (type == 'statistic') {
            this.arguments = _defineProperty({}, key.map ? 'methods' : 'method', JSON.stringify(key));
        } else if (key && key.map) {
            this.arguments = { keys: JSON.stringify(key) };
        } else if (type == 'all') {
            this.arguments = { label: JSON.stringify(key) };
        } else if (type == 'value') {
            this.arguments = _defineProperty({}, key.map ? 'values' : 'value', JSON.stringify(key));
        } else {
            this.arguments = { key: JSON.stringify(key) };
        }

        Object.keys(args || {}).map(function (k) {
            return typeof args[k] !== 'undefined' && _this.setArgument(k, args[k]);
        });
        return this;
    }

    _createClass(QueryClosure, [{
        key: 'setArgument',
        value: function setArgument(key, arg) {
            if (arg.map) {
                // handle complex array argument serialization
                this.arguments[key] = '[ ' + arg.map(function (a) {
                    return toGqlObjectArg(a);
                }) + ' ]';
                return this;
            }
            if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
                // handle object arg serialization
                this.arguments[key] = toGqlObjectArg(arg);
                return this;
            }
            this.arguments[key] = JSON.stringify(arg);
            return this;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _this2 = this;

            var args = Object.keys(this.arguments).map(function (key) {
                return key + ': ' + _this2.arguments[key];
            });

            if (this.renderId) args.push('renderId:"' + this.renderId + '"');

            var descendent = this.child ? this.child.toString() : ' node {leaf} ';

            var props = 'renderId renderIds';
            if (this.type == 'classes' || this.type == 'transpose' || this.type == 'all') props += ' label';

            var fragment = '_' + this.label + ': ' + this.type + '(' + args + ') { ' + props + ' ' + descendent + ' } ';
            this.siblings.forEach(function (sibling) {
                fragment += sibling.toString();
            });
            return fragment;
        }
    }, {
        key: 'inject',
        value: function inject(childClosure) {
            if (!this.child) this.child = childClosure;else this.child.inject(childClosure);

            this.siblings.forEach(function (sibling) {
                return sibling.inject(childClosure);
            });
            return this;
        }
    }, {
        key: 'push',
        value: function push(closure) {
            this.siblings.push(closure);
            return this;
        }
    }]);

    return QueryClosure;
}();

exports.default = QueryClosure;