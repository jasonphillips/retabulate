import ApolloClient from 'apollo-client';
import {makeLocalExecution} from 'retabulate-graphql';
import getDataset from './datasets';

// set getDataset() fetching function in query context
const localQuery = makeLocalExecution({getDataset});

// build client
const client = new ApolloClient({
  networkInterface: {
    query: (r) => new Promise((resolve, reject) => {
        localQuery(r.query, {variables: r.variables}, {}).then((data, errors) => {
            resolve({data, errors});
        })
    }),
  },
});

export default client;