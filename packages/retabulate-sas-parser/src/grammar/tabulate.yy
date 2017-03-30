/* description: Parses PROC TABULATE statements and converts to a GraphQL query. */

%{
  // stateful to allow top-down lookups (vars, classes)
  // see buildAndReset() hack below for reset
  var vars = [];
  var classes = [];
  var table = [];
  var titles = ['', '', ''];
  var prefix = 0;  
%}

/* lexical grammar */
%lex

%%

\s*<<EOF>>            return 'EOF'
(\/[^\;]+)?\s*\;                 return 'SEMI'
\s+\*                return '*'
\s+                   return 'S' /* skip whitespace */
','                   return ','
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
TABLE\s*              return 'TABLE'
"VAR"\b                 return 'VAR'
"CLASS"\b               return 'CLASS'
"ALL"\b                 return 'ALL'
\*[fF]\=[a-zA-Z]*[0-9]+\.[0-9]* return 'FORMAT'
PROC\b                return 'PROC'
TABULATE\b            return 'TABULATE'
DATA\b                return 'DATA'
RUN\b                 return 'RUN'
TITLE\b               return 'TITLE'
TITLE1\b              return 'TITLE1'
FOOTNOTE\b            return 'FOOTNOTE'
[a-zA-Z0-9]+\b        return 'TOKEN'
(\"|\')[a-zA-Z0-9\s\?\,\.\:\-]*?(\"|\')  return 'LABEL' /* " */
\*                    return '*'
'='                   return '='
"/"                   return '/'
\(                 return '('
\)                 return ')'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left S
%left '*' '/'
%left '='
%left '^'

%start tabulate

%ebnf

%% /* language grammar */

tabulate
    : PROC S* TABULATE S* DATA '=' TOKEN S* SEMI S*
        (statement S?)+ S* RUN S* SEMI EOF
        {return buildAndReset($7)}
    ;

statement
    : TABLE axis S* ',' S* axis S* SEMI { table = getAxes($2,$6) }
    | VAR S (TOKEN S?)* SEMI { vars = $3 }
    | CLASS S (TOKEN S?)* SEMI { classes = $3 }
    | TITLE S* LABEL S* SEMI { titles[0] = $3.replace(/\"/g,'') }
    | TITLE1 S* LABEL S* SEMI { titles[1] = $3.replace(/\"/g,'') }
    | FOOTNOTE S* LABEL S* SEMI { titles[2] = $3.replace(/\"/g,'') }
    ;

axis
    : e
    ;

all_type
    : ALL '=' LABEL
        {$$ = $3}
    | ALL 
        {$$ = 'Total'}
    ;

e
    : group S group 
        {$$ = $1.push($3)}
    | e S group
        {$$ = $1.push($3)}
    | group S all_type 
        {$$ = $1.setArgument('all', $3)}
    | group
        {$$ = $1}
    ;

group 
    : group S? '*' S? item
        {$$ = $1.inject($5)}
    | item 
        {$$ = $1}
    ;

item
    : '(' e ')' 
        {$$ = $2}
    | TOKEN '=' LABEL
        {$$ = tokenType($1, makeLabel($3))}
    | TOKEN '=' LABEL FORMAT
        {$$ = tokenType($1, makeLabel($3), $4)}
    | TOKEN FORMAT
        {$$ = tokenType($1, null, $2)}
    | TOKEN
        {$$ = tokenType($1)}
    ;

%%

var QC = require('./QueryClosure.js').default;

function buildAndReset(dataset) {
    var output = {
        tabulate: table.concat(), 
        set: dataset.concat(), 
        classes: classes.concat(), 
        vars: vars.concat(), 
        titles: titles.concat()
    }
    vars = [];
    classes = [];
    table = [];
    titles = ['', '', ''];
    prefix = 0;  
    return output;
}

function classClosure(name, label, all) {
  var prefix = makeLabel(label, name);
  var closure = new QC('classes', name, prefix);
  if (all) closure.setArgument('all', all);

  return closure;
}

function varClosure(name, label) {
  var prefix = makeLabel(label, name);
  var closure = new QC('variable', name, prefix);
  
  return closure;
}

function aggClosure(name, label, format) {
  var prefix = makeLabel(label, name);
  var closure = new QC('aggregation', name, prefix);
  if (format) closure.setArgument('format', `${format.split('=')[1]}`);
  
  return closure;
}

function inject(closure, inner) {
  return closure.inject(inner);
}

function getAxes(left, top) {
   var axes = `left { ${left.toString()} } `;
   if (top) axes += `top { ${top.toString()} } `;
   return axes;
}

function makeLabel(label, name) {
  var orName = (label==null) ? name : label;
  var tokened = orName && orName.replace(/[\"\']/g,'');
  if (!tokened) {
    prefix++;
    return '_'+prefix;
  }
  return tokened.replace(/\s+/g, '_');
}

function tokenType(token, label, format) {
  if (classes.indexOf(token)!==-1) {
    return classClosure(token, label);
  }
  if (vars.indexOf(token)!==-1) {
    return varClosure(token, label);
  }
  return aggClosure(token, label, format);
}