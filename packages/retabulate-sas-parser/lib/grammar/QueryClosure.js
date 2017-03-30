'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryClosure = function () {
    function QueryClosure(type, key, label) {
        _classCallCheck(this, QueryClosure);

        this.type = type;
        this.label = label;
        this.key = key;
        this.child = null;
        this.siblings = [];

        if (type == 'aggregation') {
            this.arguments = { method: key };
        } else {
            this.arguments = { key: key };
        }

        return this;
    }

    _createClass(QueryClosure, [{
        key: 'setArgument',
        value: function setArgument(key, arg) {
            this.arguments[key] = arg;
            return this;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _this = this;

            var args = Object.keys(this.arguments).map(function (key) {
                return key + ':"' + _this.arguments[key] + '"';
            });

            var descendent = this.child ? this.child.toString() : ' node {leaf} ';

            var props = this.type == 'aggregation' || this.type == 'variable' ? '' : ' label ';

            var fragment = this.label + ': ' + this.type + '(' + args + ') { ' + props + ' ' + descendent + ' } ';
            this.siblings.forEach(function (sibling) {
                fragment += sibling.toString();
            });
            return fragment;
        }
    }, {
        key: 'inject',
        value: function inject(childClosure) {
            var closure = childClosure.clone();

            if (!this.child) this.child = closure;else this.child.inject(closure);

            this.siblings.forEach(function (sibling) {
                return sibling.inject(closure);
            });
            return this;
        }
    }, {
        key: 'push',
        value: function push(closure) {
            this.siblings.push(closure);
            return this;
        }
    }, {
        key: 'clone',
        value: function clone() {
            var _this2 = this;

            var copy = new QueryClosure(this.type, this.key || this.method, this.label);
            if (this.arguments) {
                Object.keys(this.arguments).forEach(function (key) {
                    return copy.setArgument(key, _this2.arguments[key]);
                });
            }
            if (this.child) copy.inject(child.clone());
            if (this.siblings) this.siblings.forEach(function (sibling) {
                return copy.push(sibling.clone());
            });
            return copy;
        }
    }]);

    return QueryClosure;
}();

exports.default = QueryClosure;