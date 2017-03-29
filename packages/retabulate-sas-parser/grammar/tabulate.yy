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
'='                   return '='
"/"                   return '/'
\(\s*                 return '('
\s*\*\s*              return '*'
\s*\)                 return ')'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left 'S'
%left '='
%left '*' '/'
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
    : TABLE axis S* ',' S* axis S* SEMI { table = getAxes([$2,$6]) }
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
        {$$ = '"Total"'}
    ;

e
    : e S e
        {$$ = `${$1} ${$3}`}
    | e S all_type 
        {$$ = addAll($1, $3)}
    | e S? '*' S? e
        {$$ = inject($1, $5)}
    | '(' S? e S?  ')'
        {$$ = $3}
    | NUMBER
        {$$ = Number(yytext)}
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
  pre = makeLabel(label, name);
  return `${pre+': '} classes(key:"${name}" ${all ? 'total="'+all+'"' : ''}) { label node {leaf} } `
}

function varClosure(name, label) {
  pre = makeLabel(label, name);
  return `${pre+': '} variable(key:"${name}") { node {leaf} } `;
}

function allClosure(label) {
  return `${label ? makeLabel(label) : 'Total'}: node { node {leaf} }`;
}

function aggClosure(name, label, format) {
  var pre = makeLabel(label, name);
  var format = format ? `format:"${format.split('=')[1]}"` : '';
  return `${pre+': '}  aggregation(method:"${name}" ${format}) { node {leaf} } `;
}


function inject(closure, inner) {
  var match = new RegExp('node {leaf}', 'g');
  return closure.replace(match, inner);
}

function addAll(closure, all) {
   var isClasses = closure.match(/^(([^\(:]+:\s+)?classes\([^\)]+)\)/);
   if (isClasses && closure.match(/{leaf}/g).length==1) {
      return closure.replace(isClasses[0], `${isClasses[1]} all:${all})`);
   }
   return `${closure} ${allClosure(all)}`;
}

function getAxes(listed) {
   var axes = `left { ${listed[0]} } `;
   if (listed[1]) axes += `top { ${listed[1]} } `;
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