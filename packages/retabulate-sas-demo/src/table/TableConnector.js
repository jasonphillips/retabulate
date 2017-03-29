import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import NestedTable from 'retabulate-react-renderer';

const NestedTableWrapper = (props) => !props.loading 
  ? <div>
      {props.titles[0] && <h3>{props.titles[0]}</h3>}
      {props.titles[1] && <h4>{props.titles[1]}</h4>}
      <NestedTable {...props}/> 
      {props.titles[2] && <div className=".small">{props.titles[2]}</div>}
    </div>
  : <div/>;

const TableFromQuery = (query, meta) => (
  graphql(
    gql`${query}`,
    {
      options: { forceFetch: true},
      props: ({ ownProps, data: { loading, table, refetch } }) => ({
        tabulated: table,
        loading,
        refetch,
        ...meta,
      }),
    }
  )(NestedTableWrapper)
);

export default TableFromQuery;
