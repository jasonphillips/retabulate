import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import client from './data/client';
import QueryEditor from './editor/QueryEditor';
import SASEditor from './editor/SASEditor';
import TableFromQuery from './table/TableConnector';
import {withState, withHandlers, compose} from 'recompose';
import parser from 'retabulate-sas-parser';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import examples from './data/examples';


class App extends Component {
  render() {
    const {
      example, changeExample, sas, updateSAS, touched, touch, 
      query, meta, parse, Components
    } = this.props;
    const buttonActive = touched || (meta && meta.error);

    return (
      <ApolloProvider client={client}>
        <div className="App container">
          <h1>Retabulate: SAS Parser Demo</h1>
          <div className="intro">
            <div className="row">

              <div className="col col-md-8">
                <p>
                  This page allows you to test the SAS (PROC TABULATE) parser included in the 
                  <a href="http://github.com/jasonphillips/retabulate"> Retabulate</a> project. 
                </p>
                <p>
                  Write or edit the TABULATE procedure <b>(1)</b>, then click <span className="text-danger">Parse </span>
                  to have your syntax transformed into a GraphQL Retabulate query <b>(2)</b> and&nbsp;
                  executed  <b>(3)</b> against the sample dataset. 
                </p>
              </div>

              <div className="col col-md-4">
                <b>Select a Dataset:</b>
                <select className="form-control" value={example} onChange={changeExample}>
                  <option>births</option>
                  <option>deaths</option>
                </select>
              </div>

            </div>
          </div>

          <div className="row">
            <div className="col col-md-6">
              <h2>1. Proc Tabulate</h2>
              <SASEditor value={sas} updateQuery={(val) => updateSAS(val) || touch(true)}/>
              <button className={buttonActive ? "btn btn-danger" : "btn"} 
                  onClick={parse}>Parse</button>

              <div className="parse-results">
                {meta && meta.parsed && 
                  <div><br/>
                    <b style={{color:'#090'}}>Parsed</b>
                    <ul>
                      <li><b>dataset:</b> {meta.parsed.set}</li>
                      <li><b>classes:</b> {meta.parsed.classes.join(', ')}</li>
                      <li><b>vars:</b> {meta.parsed.vars.join(', ')}</li>
                    </ul>
                  </div>
                }
                {meta && meta.error && 
                  <div><br/>
                    <b style={{color:'#900'}}>Error:</b>
                    <pre>{meta.error}</pre>
                  </div>
                }
              </div>
            </div>

            <div className="col col-md-6">
              <h2>2. GraphQL Query</h2>
              <QueryEditor query={query} updateQuery={null}/>
            </div>

          </div>

          <div className="results-row">

            <h2>3. Executed Result</h2>
            <div className="results row">
              <div className="rendered-result">
                {Components && <Components.Table />}
              </div>
            </div>

          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default compose(
  withState('example', 'setExample', 'deaths'),
  withState('sas', 'updateSAS', examples.deaths),
  withState('touched', 'touch', true),
  withState('query', 'updateQuery'),
  withState('meta', 'updateMeta'),
  withState('Components', 'updateComponents'),

  withHandlers({
    changeExample: ({example, setExample, updateSAS}) => (e) => {
      setExample(e.target.value);
      updateSAS(examples[e.target.value]);
    },
    parse: ({sas, updateQuery, touch, updateComponents, updateMeta}) => () => {
      let parsed;

      try {
        parsed = parser.parse(sas);
      } catch(e) {
        updateMeta({error:e.message});
      }

      if (parsed) {
        const query = `
          query tabulate {
            table (set:"${parsed.set}") { 
              ${parsed.tabulate}
              rows {
                cells {
                  value
                  colID
                  rowID
                  variable
                  agg
                  queries {key value}
                }
              }
            }
          }
        `;

        updateQuery(query);
        touch(false);
        updateMeta({parsed});
        updateComponents({Table: TableFromQuery(query, parsed)});
      }
    }
  })
)(App);
