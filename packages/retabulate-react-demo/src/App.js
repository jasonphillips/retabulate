import React, { Component } from 'react';
import { Tabulation, RetabulateProvider, Expand, Transpose, Axis, Variable, Statistic } from 'retabulate-react';
import likert2 from './data/likert2.json';
const datasets = {likert2};

/*
  some metadata we'll need
*/
const questions = {
  q1: '1. Why?',
  q2: '2. Whence?',
  q3: '3. Whither?',
  q4: "4. Wherefore?",
}

const likertScale = [
  {text: "strongly disagree", negative: true, color: "#E05252"},
  {text: "disagree", negative: true, color: "#EC9393"},
  {text: "agree", negative: false, color: "#9FDF9F"},
  {text: "strongly agree", negative: false, color: "#66CC66"},
]

/*
  A few custom rendering components
*/

const QuestionLabel = ({cellProps, data}) => (
  <th {...cellProps}>{questions[data.label]}</th> 
)

const LikertCell = ({cellProps, cell: {value}}) => (
  <td {...cellProps} style={{padding:'0', width:'75%'}}>

    {/* negative likerts: floating right within left 50% */}
    <div style={{width:'50%', float:'left', height: '2.5em', paddingTop: '.75em', borderRight: '2px dotted #ddd'}}>
      {likertScale.filter(a => a.negative===true).reverse().map((answer,i) => 
        <div style={{
          backgroundColor: answer.color,
          float: 'right',
          height: '1em',
          width: (value[answer.text] || 0) * 100 + '%',          
        }} key={i} className="likert"/>
      )}
    </div>

    {/* positive likerts: floating left within right 50% */}
    <div style={{width:'50%', float:'left', height: '2.5em', paddingTop: '.75em'}}>
      {likertScale.filter(a => a.negative===false).map((answer,i) => 
        <div style={{
          backgroundColor: answer.color,
          float: 'left',
          height: '1em',
          width: (value[answer.text] || 0) * 100 + '%',
        }} key={i} className="likert"/>
      )}
    </div>

    <div style={{clear:'both'}}/>
  </td>
)

const LikertKey = ({cellProps}) => (
  <th {...cellProps}>
    {likertScale.map((answer,i) => 
      <span key={i}>
        &nbsp;
        <span style={{display:'inline-box', height:'1em', borderLeft: `15px solid ${answer.color}`}}/>
        &nbsp; {answer.text}
      </span>
    )}
  </th>
)

/*
  The main event
*/

class App extends Component {
  render() {
    return (
      <div className="App">
        <RetabulateProvider getDataset={(key) => Promise.resolve(datasets[key])}>
          <div>

            <h2>Survey Reporting Example with Transpose</h2>

            <h3>Basic Example</h3>

            <Tabulation dataset="likert2">
              <Axis position="left">
                <Transpose columns={Object.keys(questions)} as="question" labelRenderer={QuestionLabel}/>
              </Axis>
              <Axis position="top">
                <Variable column="question">
                  <Statistic 
                    method="distributionRatio" 
                    cellRenderer={LikertCell}
                    labelRenderer={LikertKey}
                  />
                </Variable>
              </Axis>
            </Tabulation>

            <p>&nbsp;</p>
            <h3>Broken Down by Student School</h3>

            <Tabulation dataset="likert2">
              <Axis position="left">
                <Transpose columns={Object.keys(questions)} as="question" labelRenderer={QuestionLabel}>
                  <Expand column="college"/>
                </Transpose>
              </Axis>
              <Axis position="top">
                <Variable column="question">
                  <Statistic 
                    method="n" 
                    label="Count" 
                    cellStyles={{textAlign:'right'}}
                  />
                  <Statistic 
                    method="distributionRatio" 
                    cellRenderer={LikertCell}
                    labelRenderer={LikertKey}
                  />
                </Variable>
              </Axis>
            </Tabulation>

          </div>
        </RetabulateProvider>
      </div>
    );
  }
}

export default App;
