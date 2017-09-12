export default `
  type Table {
    top: Axis
    left: Axis
    rows: [Row]
    length: Int
  }

  type Axis {
    label: String
    length: Int
    node: Axis
    leaf: ID
    renderId: String
    renderIds: [String]
    classes(key:String, all:String, total:String, orderBy:String, renderId:String): [Axis]
    transpose(keys:[String], asKey:String, renderId:String): [Axis]
    all(label:String): Axis
    variable(key:String, keys:[String], renderId:String): Variable
  }

  type Node {
    leaf: ID
    node: Node
  }

  type Variable {
    key: String
    keys: [String]
    renderId: String
    renderIds: [String]
    aggregation(method:String, format:String, over:String, renderId:String): Aggregation
    statistic(method:String, format:String, over:String, renderId:String): Aggregation
    leaf: ID
    node: Node
  }

  type Aggregation {
    method: String
    leaf: ID
    renderId: String
    renderIds: [String]
    node: Node
  }

  type Row {
    cells: [Cell]
  }

  type Cell {
    value(missing:String): String
    colID: ID
    rowID: ID
    queries: [QueryCondition]
    renderId: String
    renderIds: [String]
    variable: String
    agg: String
  }

  type QueryCondition {
    key: String
    value: String
  }

  input Condition {
    key: String!
    value: String!
  }

  type Query {
    table(set: String, where: [Condition]): Table
  }
`
