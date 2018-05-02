'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeNetworkInterface = exports.makeLocalExecution = undefined;

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

function makeLocalExecution(initialContext = {}) {
    return (query, { variables, context }) => new Promise((resolve, reject) => {
        let result;

        try {
            result = (0, _graphql.execute)(_schema2.default, query, null, Object.assign({}, initialContext, context, { isService: true }), variables, null);
        } catch (err) {
            console.log(`Local GraphQL error: ${err.message}`);
            return reject(err);
        }

        result.then(({ data, errors }) => {
            if (errors) {
                reject(errors);
                return;
            }
            resolve(data);
        });
    });
}

const makeNetworkInterface = context => {
    const localQuery = makeLocalExecution(context);

    return {
        query: r => new Promise((resolve, reject) => {
            localQuery(r.query, { variables: r.variables }, {}).then((data, errors) => {
                resolve({ data, errors });
            });
        })
    };
};

exports.makeLocalExecution = makeLocalExecution;
exports.makeNetworkInterface = makeNetworkInterface;