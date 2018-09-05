import React from 'react';
import QueryClosure from '../classes/QueryClosure';
import gatherChildConfig from '../utils/gatherChildConfig';
import makeRenderers from '../utils/makeRenderers';

class Filter extends React.Component {
  static serialize(props, index, context) {
    const {
      column, values, label, delimiter,
      cellProps, cellStyles, 
      labelRenderer, labelProps, labelStyles,
      children
    } = props;

    const {renderId, renderers} = makeRenderers({
      cellProps, cellStyles, labelRenderer, labelProps, labelStyles
    }, context);
    const Query = new QueryClosure(
      'classes', 
      column, 
      `skip_${index}`, 
      renderId, 
      {
        mapping: [{label, values}],
        delimiter,
      }
    );
    const descendents = gatherChildConfig(children, context);
    
    if (descendents.query) {
        Query.inject(descendents.query);
    }

    return {
      query: Query, 
      renderers: {...renderers, ...descendents.renderers},
      labels: descendents.labels,
    };
  }

  render() {
    return <span />;
  }
}

export default Filter;