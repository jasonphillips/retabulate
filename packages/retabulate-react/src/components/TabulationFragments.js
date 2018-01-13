import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import NestedTable from 'retabulate-react-renderer';
import WrapRenderer from './WrapRenderer';
import {toGqlObjectArg} from '../classes/QueryClosure';
import {callChildSerializers} from '../utils/gatherChildConfig';
import get from 'lodash.get';

const fragmentTemplate = (rootType, name, dataset, where, axes) => `
  fragment ${name}Fragment on ${rootType} {
    ${name}: table(set:"${dataset}" ${where}) {
      ${axes}
      rows {
        cells {
          value colID rowID variable agg renderIds
          queries { key values }
        }
      }
    }
  }
`;

class Tabulation extends React.Component {
  constructor(props, context) {
    super(props);
    const {renderers, labels} = Tabulation.getRenderers(props);

    this.state = { 
        renderers: renderers || {},
        labels: labels || {},
    };
  }

  static getRenderers(props) {
    const {dataset, where, children, name, config} = props;

    const axes = callChildSerializers(children, {iterator:0});
    const renderers =axes.reduce((r,a) => ({...r, ...a.renderers}), {});
    const labels = axes.reduce((r,a) => ({...r, ...a.labels}), {});

    return {renderers, labels};
  }

  static getFragment(props) {
    const {dataset, where, children, name, config} = props;
    const rootType = config ? config.rootType : '';

    const axes = callChildSerializers(children, {iterator:0});

    // if where conditions
    const whereArg = where ? `where: [${where.map(condition => toGqlObjectArg(condition))}]` : '';
    
    return fragmentTemplate(rootType, name, dataset, whereArg, axes.map(a => a.queryFragment).join(' '));
  }

  static getData(source, tableName, rootPath) {
    // in some context, stringifying first is prudential
    const parsedSource = typeof(source)==='string' ? JSON.parse(source) : source;
    if (!tableName) return parsedSource;
    return get(parsedSource, rootPath.map ? rootPath.concat([tableName]) : rootPath + tableName);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.watchedProps) {
      const changed = Object.keys(this.props.watchedProps).reduce((should,prop) => 
          (this.props.watchedProps[prop] !== nextProps.watchedProps[prop]) ? true : should
      , false);
      if (changed) {
        const {renderers, labels} = Tabulation.getRenderers(nextProps);
        this.setState({ renderers, labels });
      }
    }
  }

  render() {
    const {renderers, labels} = this.state;
    const {
      collectionRenderer, className, tabs, data, placeholder, cellRenderer, name, config, watchedProps
    } = this.props;
    const rootPath = config ? config.rootType : '';

    if (!data && !tabs) return placeholder ? React.createElement(placeholder, {}) : <div />;
    const tableData = tabs ? Tabulation.getData(tabs, name, rootPath) : Tabulation.getData(data);

    if (collectionRenderer) return <WrapRenderer renderer={collectionRenderer} data={tableData} />

    return (
      <div>
        <NestedTable 
          tabulated={tableData}
          renderers={{...renderers, cellRenderer}} 
          labels={labels}
          pending={false}
          watchedProps={watchedProps}
          className={className}
        />
      </div>
    );
  }
}

export default Tabulation;