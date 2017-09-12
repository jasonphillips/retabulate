'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeNetworkInterface = exports.makeLocalExecution = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphql = require('graphql');

var _graphql2 = _interopRequireDefault(_graphql);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  create function to execute local graphql queries directly against schema;
 *  adapted from: https://github.com/af/apollo-local-query
 *  @param {object} initialContext - will be merged with context of indiv. queries
 *  @returns {function}
**/

function makeLocalExecution() {
    var initialContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return function (query, _ref) {
        var variables = _ref.variables,
            context = _ref.context;
        return new Promise(function (resolve, reject) {
            var result = void 0;

            try {
                result = (0, _graphql.execute)(_schema2.default, query, null, _extends({}, initialContext, context, { isService: true }), variables, null);
            } catch (err) {
                console.log('Local GraphQL error: ' + err.message);
                return reject(err);
            }

            result.then(function (_ref2) {
                var data = _ref2.data,
                    errors = _ref2.errors;

                if (errors) {
                    reject(errors);
                    return;
                }
                resolve(data);
            });
        });
    };
}

var makeNetworkInterface = function makeNetworkInterface(context) {
    var localQuery = makeLocalExecution(context);

    return {
        query: function query(r) {
            return new Promise(function (resolve, reject) {
                localQuery(r.query, { variables: r.variables }, {}).then(function (data, errors) {
                    resolve({ data: data, errors: errors });
                });
            });
        }
    };
};

exports.makeLocalExecution = makeLocalExecution;
exports.makeNetworkInterface = makeNetworkInterface;