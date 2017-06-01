"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Table {\n    top: Axis\n    left: Axis\n    rows: [Row]\n    length: Int\n  }\n\n  type Axis {\n    label: String\n    length: Int\n    node: Axis\n    leaf: ID\n    classes(key:String, all:String, total:String, orderBy:String): [Axis]\n    all(label:String): Axis\n    variable(key:String): Variable\n  }\n\n  type Node {\n    leaf: ID\n    node: Node\n  }\n\n  type Variable {\n    key: String\n    aggregation(method:String, format:String, over:String): Aggregation\n    leaf: ID\n    node: Node\n  }\n\n  type Aggregation {\n    method: String\n    leaf: ID\n    node: Node\n  }\n\n  type Row {\n    cells: [Cell]\n  }\n\n  type Cell {\n    value(missing:String): String\n    colID: ID\n    rowID: ID\n    queries: [QueryCondition]\n    variable: String\n    agg: String\n  }\n\n  type QueryCondition {\n    key: String\n    value: String\n  }\n\n  input Condition {\n    key: String!\n    value: String!\n  }\n\n  type Query {\n    table(set: String, where: [Condition]): Table\n  }\n";