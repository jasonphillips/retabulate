'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            this.arguments = { method: key };
        } else if (key.map) {
            this.arguments = { keys: key };
        } else {
            this.arguments = { key: key };
        }

        Object.keys(args || {}).map(function (k) {
            return typeof args[k] !== 'undefined' && _this.setArgument(k, args[k]);
        });
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
            var _this2 = this;

            var args = Object.keys(this.arguments).map(function (key) {
                return key + ': ' + JSON.stringify(_this2.arguments[key]);
            });

            if (this.renderId) args.push('renderId:"' + this.renderId + '"');

            var descendent = this.child ? this.child.toString() : ' node {leaf} ';

            var props = 'renderId renderIds';
            if (this.type == 'classes' || this.type == 'transpose') props += ' label';

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