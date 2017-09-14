import React from 'react';
import QueryClosure from '../classes/QueryClosure';
import makeRenderers from '../utils/makeRenderers';

class Statistic extends React.Component {
  static serialize(props, index, context) {
    const {
      method, label, over,
      cellRenderer, cellProps, cellStyles,  formatter, 
      labelRenderer, labelProps, labelStyles,
      children
    } = props;
    const useLabel = (typeof(label)==='undefined') ? method : label;

    const {renderId, renderers} = makeRenderers({
      cellProps, cellStyles, cellRenderer, labelRenderer, labelProps, labelStyles, formatter
    }, context);
    const Query = new QueryClosure('statistic', method, renderId, renderId, {over});

    return {query: Query, renderers, labels: {[`_${renderId}`]: useLabel}};
  }

  render() {
    return <span />;
  }
}

export default Statistic;