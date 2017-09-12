import React from 'react';
import _ from 'lodash';
import buildGroups from '../utils/buildGroups';
import buildRows from '../utils/buildRows';
import {mergeCellRenderers, getRenderer, getLabelRenderer} from '../utils/getRenderers';

const BasicCell = ({cell: {value, queries, variable, agg}, cellID, cellProps}) => (
  <td id={cellID} {...cellProps}>
    {value}
  </td>
)

const Th = ({cellProps, data}) => <th {...cellProps}>{data.label}</th>;


class NestedTable extends React.PureComponent {
  render() {
    const {tabulated, renderers, labels} = this.props;

    const topGrouped = buildGroups(tabulated.top);
    const leftGrouped = buildGroups(tabulated.left);

    Object.assign(labels, topGrouped.labels);
    Object.assign(labels, leftGrouped.labels);

    const topRows = buildRows(topGrouped.groups);
    const leftRows = buildRows(leftGrouped.groups, true);

    return (
        <table className="table table-bordered">
          <thead>
            {topRows.map((row,i) =>
              <tr key={i}>
                {i===0 && <td rowSpan={topRows.length}
                            colSpan={leftRows.length}
                            className="corner"> </td>}
                {row.map((cell, j) => {
                  const cellProps = _.pick(cell, 'colSpan');
                  const renderId = cell.label.split('|')[0];
                  
                  const mergedProps = mergeCellRenderers(renderId, cellProps, renderers, true);
                  const LabelRenderer = getLabelRenderer(renderId, renderers);

                  return (
                    React.createElement(LabelRenderer || Th, {
                      key: j,
                      cellProps: mergedProps,
                      data: {...cell, label: labels[cell.label] || cell.label}
                    })
                  );
                })}
              </tr>
            )}
          </thead>
          <tbody>
            {_.range(0, leftRows[0].length).map(i =>
              <tr key={i}>

                {leftRows.map((row, j) => {
                    if (!row[i]) return;

                    const cell = row[i];
                    const renderId = cell.label.split('|')[0];

                    const cellProps = _.pick(cell, 'rowSpan');
                    const mergedProps = mergeCellRenderers(renderId, cellProps, renderers, true);
                    const LabelRenderer = getLabelRenderer(renderId, renderers);

                    return (
                      React.createElement(LabelRenderer || Th, {
                        key: j,
                        cellProps: mergedProps,
                        data: {...cell, label: labels[cell.label] || cell.label}
                      })
                    );
                })}

                {tabulated.rows[i].cells.map((cell,j) => {
                  const mergedProps = mergeCellRenderers(cell.renderIds, {value: cell.value}, renderers);
                  const CellRenderer = getRenderer(cell, renderers) || BasicCell;
                  // value is the one non-cell prop that can be overwritten
                  if (typeof(mergedProps.value)!=='undefined') {
                    let parsed = mergedProps.value;
                    try { parsed = JSON.parse(mergedProps.value) } catch(e) { }
                    cell = Object.assign({}, cell, {value: parsed});
                    delete mergedProps.value;
                  }

                  return React.createElement(CellRenderer, {
                    key: `${i}${j}`,
                    cellID: `cell-${i}${j}`,
                    cellProps: mergedProps,
                    cell,
                  }, labels[cell.label] || cell.label);
                })}

              </tr>
            )}
          </tbody>
        </table>
    )
  }
}

export default NestedTable;
