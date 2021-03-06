/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var tabulate = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[6,27],$V1=[8,27],$V2=[12,27],$V3=[20,26,27,29,31,35,38],$V4=[1,18],$V5=[1,19],$V6=[1,20],$V7=[1,21],$V8=[1,22],$V9=[1,23],$Va=[16,27],$Vb=[16,20,26,29,31,35,38],$Vc=[2,30],$Vd=[1,27],$Ve=[1,33],$Vf=[1,32],$Vg=[27,33],$Vh=[16,20,26,27,29,31,35,38],$Vi=[23,27],$Vj=[1,43],$Vk=[2,64],$Vl=[12,23,27,46,50],$Vm=[10,12],$Vn=[2,65],$Vo=[10,27,49],$Vp=[12,23,27,50],$Vq=[10,49];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"tabulate":3,"PROC":4,"tabulate_repetition0":5,"TABULATE":6,"tabulate_repetition1":7,"DATA":8,"=":9,"TOKEN":10,"tabulate_repetition2":11,"SEMI":12,"tabulate_repetition3":13,"tabulate_repetition_plus4":14,"tabulate_repetition5":15,"RUN":16,"tabulate_repetition6":17,"EOF":18,"statement":19,"TABLE":20,"axis":21,"statement_repetition0":22,",":23,"statement_repetition1":24,"statement_repetition2":25,"VAR":26,"S":27,"statement_repetition3":28,"CLASS":29,"statement_repetition4":30,"TITLE":31,"statement_repetition5":32,"LABEL":33,"statement_repetition6":34,"TITLE1":35,"statement_repetition7":36,"statement_repetition8":37,"FOOTNOTE":38,"statement_repetition9":39,"statement_repetition10":40,"e":41,"all_type":42,"ALL":43,"group":44,"group_option0":45,"*":46,"group_option1":47,"item":48,"(":49,")":50,"FORMAT":51,"tabulate_repetition_plus4_option0":52,"statement_repetition3_option0":53,"statement_repetition4_option0":54,"$accept":0,"$end":1},
terminals_: {2:"error",4:"PROC",6:"TABULATE",8:"DATA",9:"=",10:"TOKEN",12:"SEMI",16:"RUN",18:"EOF",20:"TABLE",23:",",26:"VAR",27:"S",29:"CLASS",31:"TITLE",33:"LABEL",35:"TITLE1",38:"FOOTNOTE",43:"ALL",46:"*",49:"(",50:")",51:"FORMAT"},
productions_: [0,[3,16],[19,8],[19,4],[19,4],[19,5],[19,5],[19,5],[21,1],[42,3],[42,1],[41,3],[41,3],[41,3],[41,1],[44,5],[44,1],[48,3],[48,3],[48,4],[48,2],[48,1],[5,0],[5,2],[7,0],[7,2],[11,0],[11,2],[13,0],[13,2],[52,0],[52,1],[14,2],[14,3],[15,0],[15,2],[17,0],[17,2],[22,0],[22,2],[24,0],[24,2],[25,0],[25,2],[53,0],[53,1],[28,0],[28,3],[54,0],[54,1],[30,0],[30,3],[32,0],[32,2],[34,0],[34,2],[36,0],[36,2],[37,0],[37,2],[39,0],[39,2],[40,0],[40,2],[45,0],[45,1],[47,0],[47,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return buildAndReset($$[$0-9])
break;
case 2:
 table = getAxes($$[$0-6],$$[$0-2]) 
break;
case 3:
 vars = $$[$0-1] 
break;
case 4:
 classes = $$[$0-1] 
break;
case 5:
 titles[0] = $$[$0-2].replace(/\"/g,'') 
break;
case 6:
 titles[1] = $$[$0-2].replace(/\"/g,'') 
break;
case 7:
 titles[2] = $$[$0-2].replace(/\"/g,'') 
break;
case 9: case 14: case 16:
this.$ = $$[$0]
break;
case 10:
this.$ = 'Total'
break;
case 11: case 12:
this.$ = $$[$0-2].push($$[$0])
break;
case 13:
this.$ = $$[$0-2].setArgument('all', $$[$0])
break;
case 15:
this.$ = $$[$0-4].inject($$[$0])
break;
case 17:
this.$ = $$[$0-1]
break;
case 18:
this.$ = tokenType($$[$0-2], makeLabel($$[$0]))
break;
case 19:
this.$ = tokenType($$[$0-3], makeLabel($$[$0-1]), $$[$0])
break;
case 20:
this.$ = tokenType($$[$0-1], null, $$[$0])
break;
case 21:
this.$ = tokenType($$[$0])
break;
case 22: case 24: case 26: case 28: case 34: case 36: case 38: case 40: case 42: case 46: case 50: case 52: case 54: case 56: case 58: case 60: case 62:
this.$ = [];
break;
case 23: case 25: case 27: case 29: case 35: case 37: case 39: case 41: case 43: case 53: case 55: case 57: case 59: case 61: case 63:
$$[$0-1].push($$[$0]);
break;
case 32:
this.$ = [$$[$0-1]];
break;
case 33: case 47: case 51:
$$[$0-2].push($$[$0-1]);
break;
}
},
table: [{3:1,4:[1,2]},{1:[3]},o($V0,[2,22],{5:3}),{6:[1,4],27:[1,5]},o($V1,[2,24],{7:6}),o($V0,[2,23]),{8:[1,7],27:[1,8]},{9:[1,9]},o($V1,[2,25]),{10:[1,10]},o($V2,[2,26],{11:11}),{12:[1,12],27:[1,13]},o($V3,[2,28],{13:14}),o($V2,[2,27]),{14:15,19:17,20:$V4,26:$V5,27:[1,16],29:$V6,31:$V7,35:$V8,38:$V9},o($Va,[2,34],{15:24,19:25,20:$V4,26:$V5,29:$V6,31:$V7,35:$V8,38:$V9}),o($V3,[2,29]),o($Vb,$Vc,{52:26,27:$Vd}),{10:$Ve,21:28,41:29,44:30,48:31,49:$Vf},{27:[1,34]},{27:[1,35]},o($Vg,[2,52],{32:36}),o($Vg,[2,56],{36:37}),o($Vg,[2,60],{39:38}),{16:[1,39],27:[1,40]},o($Vb,$Vc,{52:41,27:$Vd}),o($Vh,[2,32]),o($Vh,[2,31]),o($Vi,[2,38],{22:42}),o([12,23],[2,8],{27:$Vj}),o([12,23,50],[2,14],{45:45,27:[1,44],46:$Vk}),o($Vl,[2,16]),{10:$Ve,41:46,44:30,48:31,49:$Vf},o($Vl,[2,21],{9:[1,47],51:[1,48]}),o($Vm,[2,46],{28:49}),o($Vm,[2,50],{30:50}),{27:[1,52],33:[1,51]},{27:[1,54],33:[1,53]},{27:[1,56],33:[1,55]},o($V2,[2,36],{17:57}),o($Va,[2,35]),o($Vh,[2,33]),{23:[1,58],27:[1,59]},{10:$Ve,44:60,48:31,49:$Vf},{10:$Ve,42:62,43:[1,63],44:61,46:$Vn,48:31,49:$Vf},{46:[1,64]},{27:$Vj,50:[1,65]},{33:[1,66]},o($Vl,[2,20]),{10:[1,68],12:[1,67]},{10:[1,70],12:[1,69]},o($V2,[2,54],{34:71}),o($Vg,[2,53]),o($V2,[2,58],{37:72}),o($Vg,[2,57]),o($V2,[2,62],{40:73}),o($Vg,[2,61]),{12:[1,74],27:[1,75]},o($Vo,[2,40],{24:76}),o($Vi,[2,39]),o($Vp,[2,12],{45:45,46:$Vk}),o($Vp,[2,11],{45:45,46:$Vk}),o($Vp,[2,13]),o($Vp,[2,10],{9:[1,78]}),o($Vq,[2,66],{47:79,27:[1,80]}),o($Vl,[2,17]),o($Vl,[2,18],{51:[1,81]}),o($Vh,[2,3]),o($Vm,[2,44],{53:82,27:[1,83]}),o($Vh,[2,4]),o($Vm,[2,48],{54:84,27:[1,85]}),{12:[1,86],27:[1,87]},{12:[1,88],27:[1,89]},{12:[1,90],27:[1,91]},{18:[1,92]},o($V2,[2,37]),{10:$Ve,21:93,27:[1,94],41:29,44:30,48:31,49:$Vf},{46:$Vn},{33:[1,95]},{10:$Ve,48:96,49:$Vf},o($Vq,[2,67]),o($Vl,[2,19]),o($Vm,[2,47]),o($Vm,[2,45]),o($Vm,[2,51]),o($Vm,[2,49]),o($Vh,[2,5]),o($V2,[2,55]),o($Vh,[2,6]),o($V2,[2,59]),o($Vh,[2,7]),o($V2,[2,63]),{1:[2,1]},o($V2,[2,42],{25:97}),o($Vo,[2,41]),o($Vp,[2,9]),o($Vl,[2,15]),{12:[1,98],27:[1,99]},o($Vh,[2,2]),o($V2,[2,43])],
defaultActions: {77:[2,65],92:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  // stateful to allow top-down lookups (vars, classes)
  // see buildAndReset() hack below for reset
  var vars = [];
  var classes = [];
  var table = [];
  var titles = ['', '', ''];
  var prefix = 0;  


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
}/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 18
break;
case 1:return 12
break;
case 2:return 46
break;
case 3:return 27 /* skip whitespace */
break;
case 4:return 23
break;
case 5:return 'NUMBER'
break;
case 6:return 20
break;
case 7:return 26
break;
case 8:return 29
break;
case 9:return 43
break;
case 10:return 51
break;
case 11:return 4
break;
case 12:return 6
break;
case 13:return 8
break;
case 14:return 16
break;
case 15:return 31
break;
case 16:return 35
break;
case 17:return 38
break;
case 18:return 10
break;
case 19:return 33 /* " */
break;
case 20:return 46
break;
case 21:return 9
break;
case 22:return '/'
break;
case 23:return 49
break;
case 24:return 50
break;
case 25:return 'INVALID'
break;
}
},
rules: [/^(?:\s*$)/,/^(?:(\/[^\;]+)?\s*;)/,/^(?:\s+\*)/,/^(?:\s+)/,/^(?:,)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:TABLE\s*)/,/^(?:VAR\b)/,/^(?:CLASS\b)/,/^(?:ALL\b)/,/^(?:\*[fF]=[a-zA-Z]*[0-9]+\.[0-9]*)/,/^(?:PROC\b)/,/^(?:TABULATE\b)/,/^(?:DATA\b)/,/^(?:RUN\b)/,/^(?:TITLE\b)/,/^(?:TITLE1\b)/,/^(?:FOOTNOTE\b)/,/^(?:[a-zA-Z0-9]+\b)/,/^(?:("|')[a-zA-Z0-9\s\?\,\.\:\-]*?("|'))/,/^(?:\*)/,/^(?:=)/,/^(?:\/)/,/^(?:\()/,/^(?:\))/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = tabulate;
exports.Parser = tabulate.Parser;
exports.parse = function () { return tabulate.parse.apply(tabulate, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}