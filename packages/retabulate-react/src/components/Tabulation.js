import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import NestedTable from 'retabulate-react-renderer';
import {callChildSerializers} from '../utils/gatherChildConfig';

const queryTemplate = (dataset, axes) => gql`
    query tabulate {
        table(set:"${dataset}") {
            ${axes}
            rows {
              cells {
                value colID rowID variable agg renderIds
                queries { key value }
              }
            }
        }
    }
`;

class Tabulation extends React.Component {
  constructor(props, context) {
    super(props);
    this.startQuery = this.startQuery.bind(this);
    this.client = context.RetabulateClient;
    
    const {query, renderers, labels} = this.getQuery(props);
    this.startQuery(query);

    this.state = { 
        pending: true, 
        data: null,
        renderers: renderers || {},
        labels: labels || {},
    };
  }

  getQuery(props) {
    const {dataset, children} = props;
    const axes = callChildSerializers(children, {iterator:0});
    const renderers =axes.reduce((r,a) => ({...r, ...a.renderers}), {});
    const labels = axes.reduce((r,a) => ({...r, ...a.labels}), {});
    
    return {
        query: queryTemplate(dataset, axes.map(a => a.queryFragment).join(' ')),
        renderers,
        labels
    }
  }

  startQuery(query) {
    this.client.query({query})
      .then(data => this.setState({data, pending: false}))
      .catch(console.error);
  }

  render() {
    const {data, pending, renderers, labels} = this.state;
    const {cellRenderer} = this.props;

    return (
        <div>
            {!pending && 
                <NestedTable 
                    tabulated={data.data.table}
                    renderers={{...renderers, cellRenderer}} 
                    labels={labels}
                />
            }
        </div>
    );
  }
}

Tabulation.contextTypes = {
    RetabulateClient: PropTypes.object
}

export default Tabulation;