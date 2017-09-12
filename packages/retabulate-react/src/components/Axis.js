import React from 'react';
import gatherChildConfig from '../utils/gatherChildConfig';
import makeRenderers from '../utils/makeRenderers';

class Axis extends React.Component {
  static serialize(props, index, context) {
    const {position, children} = props;

    const descendents = gatherChildConfig(children, context);

    return {
      queryFragment: `${position} { ${descendents.query.toString()} }`,
      renderers: descendents.renderers,
      labels: descendents.labels,
    }
  }

  render() {
    return <span />;
  }
}

export default Axis;