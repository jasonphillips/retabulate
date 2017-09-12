import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient from 'apollo-client';
import {makeNetworkInterface} from 'retabulate-graphql';

class RetabulateProvider extends React.Component {
    constructor(props) {
        super(props);
        const {getDataset} = props;

        this.client = new ApolloClient({
            networkInterface: makeNetworkInterface({getDataset})
        });
    }

    getChildContext() {
        return {RetabulateClient: this.client};
    }

    render() {
        return this.props.children;
    }
}

RetabulateProvider.childContextTypes = {
    RetabulateClient: PropTypes.object
}

export default RetabulateProvider;