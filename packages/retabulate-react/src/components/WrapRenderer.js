import React from 'react';

// converts cells to a collection to be used in charts, etc
const WrapRenderer = ({data, renderer}) => {
  const cells = data.rows.map(r => r.cells).reduce((all,a) => all.concat(a), [])

  const collection = cells.map(
    c => ({
      ...c.queries.reduce((combined, {key,value}) => ({...combined, [key]: value}), {}),
      value: JSON.parse(c.value),
      agg: c.agg,
      variable: c.variable,
    })
  );

  return React.createElement(renderer, {data: collection});
}

export default WrapRenderer;
