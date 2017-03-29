import React from 'react';
import dot from 'dot-object';
import _ from 'lodash';
import buildGroups from './buildGroups';
import buildRows from './buildRows';
import { Tooltip } from 'reactstrap';

class ActiveCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tooltip:false};
  }

  render() {
    const {cell: {value, queries, variable, agg}, cellID} = this.props;
    const {tooltip} = this.state;

    return (
      <td id={cellID}>
        {value}
        <Tooltip target={cellID} isOpen={tooltip}
            toggle={() => this.setState({tooltip:!tooltip})}
            delay={{ show: 500, hide: 250 }}>
          <h4>{variable ? `${variable} | ${agg}` : agg}</h4>
          {queries.map(({key, value}) =>
            <div key={key}><b>{key}: </b> {value}</div>
          )}
        </Tooltip>
      </td>
    )
  }
}

class NestedTable extends React.PureComponent {
  render() {
    const {tabulated} = this.props;

    const top = dot.dot(tabulated.top)
    const left = dot.dot(tabulated.left)

    const topGrouped = buildGroups(top);
    const leftGrouped = buildGroups(left);

    const topRows = buildRows(topGrouped);
    const leftRows = buildRows(leftGrouped, true);

    return (
        <table className="table table-bordered" style={{margin:'1em'}}>
          <thead>
            {topRows.map((row,i) =>
              <tr key={i}>
                {i===0 && <td rowSpan={topRows.length}
                            colSpan={leftRows.length}
                            className="corner"> </td>}
                {row.map((cell, j) =>
                  <th key={j} colSpan={cell.colSpan}>{(cell.label || '').replace('_', ' ')}</th>
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {_.range(0, leftRows[0].length).map(i =>
              <tr key={i}>
                { leftRows.map((row, j) =>
                    row[i] &&
                    <th key={j} rowSpan={row[i].rowSpan}>{(row[i].label || '').replace('_', ' ')}</th>
                )}
                {tabulated.rows[i].cells.map((cell,j) =>
                    <ActiveCell key={`${i}${j}`} cellID={`cell-${i}${j}`} cell={cell}/>
                )}
              </tr>
            )}
          </tbody>
        </table>
    )
  }
}

export default NestedTable;
