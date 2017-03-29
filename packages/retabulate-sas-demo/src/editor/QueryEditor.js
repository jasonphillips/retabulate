import React from 'react';
import {print, parse} from 'graphql';
import CodeMirror from 'react-codemirror';
import 'codemirror-graphql/mode';
import './staticGraphql.css';
import 'codemirror/lib/codemirror.css';

const Static = ({query}) => 
  <CodeMirror
    value={query && print(parse(query))}
    onChange={() => {}}
    options={{readOnly:true, mode:'graphql'}}
  />

export default Static;
