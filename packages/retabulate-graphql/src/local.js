import graphql, {execute} from 'graphql';
import schema from './schema';

/**
 *  create function to execute local graphql queries directly against schema;
 *  adapted from: https://github.com/af/apollo-local-query
 *  @param {object} initialContext - will be merged with context of indiv. queries
 *  @returns {function}
**/

function makeLocalExecution(initialContext = {}) {
    return (query, {variables, context}) => new Promise((resolve, reject) => {
        let result; 

        try {
            result = execute(schema, query, null, {...initialContext, ...context, isService: true}, variables, null)
        } catch (err) {
            console.log(`Local GraphQL error: ${err.message}`);
            return reject(err)
        }

        result.then(({data, errors}) => {
            if (errors) {
                reject(errors);
                return;
            }
            resolve(data)
        });
    });
}

const makeNetworkInterface = (context) => {
    const localQuery = makeLocalExecution(context);
    
    return {
        query: (r) => new Promise((resolve, reject) => {
            localQuery(r.query, {variables: r.variables}, {}).then((data, errors) => {
                resolve({data, errors});
            })
        }),
    };
};

export {makeLocalExecution, makeNetworkInterface};