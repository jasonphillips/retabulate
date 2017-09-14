import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import NestedTable from 'retabulate-react-renderer';
import {toGqlObjectArg} from '../classes/QueryClosure';
import {callChildSerializers} from '../utils/gatherChildConfig';

const queryTemplate = (dataset, where, axes) => gql`
    query tabulate {
        table(set:"${dataset}" ${where}) {
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
    this.updateQuery = this.updateQuery.bind(this);
    this.client = context.RetabulateClient;
    
    const {query, renderers, labels} = this.getQuery(props);

    this.state = { 
        pending: true, 
        data: null,
        renderers: renderers || {},
        labels: labels || {},
    };

    this.startQuery(query).then(data => this.setState({data, pending: false}));
  }

  updateQuery(props) {
    const {query, renderers, labels} = this.getQuery(props);
    this.setState({pending:true});

    this.startQuery(query).then(data => this.setState({
        data, 
        pending: false,
        renderers: renderers || {},
        labels: labels || {},
    }));

    return true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // network pending status or data object change
    if (
        nextState.pending !== this.state.pending ||
        nextState.data !== this.state.data
    ) return true;
    
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // watched props: dataset / where
    if (
        nextProps.dataset !== this.props.dataset ||
        JSON.stringify(nextProps.where) != JSON.stringify(this.props.where)
    ) this.updateQuery(nextProps);
    // user-defined watched props
    if (this.props.watchedProps) {
        const changed = Object.keys(this.props.watchedProps).reduce((should,prop) => 
            (this.props.watchedProps[prop] !== nextProps.watchedProps[prop]) ? true : should
        , false);
        if (changed) this.updateQuery(nextProps);
    }
  }

  getQuery(props) {
    const {dataset, where, children} = props;
    const axes = callChildSerializers(children, {iterator:0});
    const renderers =axes.reduce((r,a) => ({...r, ...a.renderers}), {});
    const labels = axes.reduce((r,a) => ({...r, ...a.labels}), {});

    // if where conditions
    const whereArg = where ? `where: [${where.map(condition => toGqlObjectArg(condition))}]` : '';
    
    return {
        query: queryTemplate(dataset, whereArg, axes.map(a => a.queryFragment).join(' ')),
        renderers,
        labels
    }
  }

  startQuery(query) {
    return new Promise((res, rej) => 
        this.client.query({query, fetchPolicy:'network-only'})
          .then(data => res(data))
          .catch(console.error)
    );
  }

  render() {
    const {data, pending, renderers, labels} = this.state;
    const {cellRenderer} = this.props;

    return (
        <div>
            {data && 
                <NestedTable 
                    tabulated={data.data.table}
                    renderers={{...renderers, cellRenderer}} 
                    labels={labels}
                    pending={pending}
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