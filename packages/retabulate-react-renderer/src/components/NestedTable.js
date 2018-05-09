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

// fetches flat array of all cells matching row or colid
const findCells = (tabs, rowOrCol, ids) => cellsToCollection(
  rowOrCol==='row'
    ? tabs.rows.filter(r => ids.indexOf(r.cells[0].rowID)>-1)
        .reduce((all,r) => all.concat(r.cells), [])
    : tabs.rows[0].cells.reduce((found,c,i) => found.concat(
        ids.indexOf(c.colID)>-1 
          ? tabs.rows.map(r => r.cells[i])
          : []
        )
      , [])
)

// given array of cells, converts to clean collection 
const cellsToCollection = (cells) => cells.map(
  c => ({
    ...c.queries.reduce((combined, {key,value}) => ({...combined, [key]: value}), {}),
    value: JSON.parse(c.value),
    agg: c.agg,
    variable: c.variable,
  })
)

class NestedTable extends React.PureComponent {
  render() {
    const {tabulated, pending, renderers, labels, className, corner} = this.props;

    const topGrouped = buildGroups(tabulated.top);
    const leftGrouped = buildGroups(tabulated.left);

    Object.assign(labels, topGrouped.labels);
    Object.assign(labels, leftGrouped.labels);

    const topRows = buildRows(topGrouped);
    const leftRows = buildRows(leftGrouped, true);

    this.findCells = findCells.bind(null, tabulated);

    return (
        <table className={`retabulate-table ${className || ''}`} style={{opacity: pending ? '0.25' : '1'}}>
          <thead>
            {topRows.map((row,i) =>
              <tr key={i}>
                {i===0 && <td rowSpan={topRows.length}
                            colSpan={leftRows.length}
                            className="corner">{corner || ' '}</td>}
                {row.map((cell, j) => {
                  const cellProps = _.pick(cell, 'colSpan');
                  const renderId = cell.label && cell.label.split('|')[0];
                  
                  const mergedProps = mergeCellRenderers(renderId, cellProps, renderers, true);
                  const LabelRenderer = getLabelRenderer(renderId, renderers);

                  return (
                    React.createElement(LabelRenderer || Th, {
                      key: j,
                      cellProps: mergedProps,
                      data: {...cell, label: labels[cell.label] || cell.label},
                      getCells: this.findCells.bind(null, 'col', cell.leaves),
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
                    const renderId = cell.label && cell.label.split('|')[0];

                    const cellProps = _.pick(cell, 'rowSpan');
                    const mergedProps = mergeCellRenderers(renderId, cellProps, renderers, true);
                    const LabelRenderer = getLabelRenderer(renderId, renderers);

                    return (
                      React.createElement(LabelRenderer || Th, {
                        key: j,
                        cellProps: mergedProps,
                        data: {...cell, label: labels[cell.label] || cell.label},
                        getCells: this.findCells.bind(null, 'row', cell.leaves),
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
                    key: `${cell.colID}${cell.rowID}`,
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
