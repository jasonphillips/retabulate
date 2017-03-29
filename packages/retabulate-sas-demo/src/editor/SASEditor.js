import React from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/sas/sas';
import 'codemirror/lib/codemirror.css';
import './staticGraphql.css';

const SASEditor = ({value, updateQuery}) => 
  <CodeMirror
    value={value}
    onChange={(val) => updateQuery(val)}
    options={{mode:'sas'}}
    className="sas-codeMirror"
  />

export default SASEditor;
