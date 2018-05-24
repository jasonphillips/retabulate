import React from 'react';
import PropTypes from 'prop-types';
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import schema from 'retabulate-graphql';

class RetabulateProvider extends React.Component {
  constructor(props) {
    super(props);
    const { getDataset } = props;

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new SchemaLink({ schema, context: { getDataset } })
    });
  }

  getChildContext() {
    return { RetabulateClient: this.client };
  }

  render() {
    return this.props.children;
  }
}

RetabulateProvider.childContextTypes = {
  RetabulateClient: PropTypes.object
}

export default RetabulateProvider;