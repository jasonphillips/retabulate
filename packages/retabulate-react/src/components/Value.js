import React from 'react';
import QueryClosure from '../classes/QueryClosure';
import gatherChildConfig from '../utils/gatherChildConfig';
import makeRenderers from '../utils/makeRenderers';

class Header extends React.Component {
  static serialize(props, index, context) {
    const {
      value, values, label,
      cellProps, cellStyles, 
      labelRenderer, labelProps, labelStyles,
      children
    } = props;

    const {renderId, renderers} = makeRenderers({
      cellProps, cellStyles, labelRenderer, labelProps, labelStyles
    }, context);
    const Query = new QueryClosure('value', value || values, renderId, renderId);
    const descendents = gatherChildConfig(children, context);
    
    if (descendents.query) {
        Query.inject(descendents.query);
    }

    return {
      query: Query, 
      renderers: {...renderers, ...descendents.renderers},
      labels: {[`_${renderId}`]: label || value, ...descendents.labels},
    };
  }

  render() {
    return <span />;
  }
}

export default Header;