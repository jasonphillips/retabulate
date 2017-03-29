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
    classes(key:String, all:String, total:String): [Axis]
    all(label:String): Axis
    variable(key:String): Variable
  }

  type Node {
    leaf: ID
    node: Node
  }

  type Variable {
    key: String
    aggregation(method:String, format:String): Aggregation
    leaf: ID
    node: Node
  }

  type Aggregation {
    method: String
    leaf: ID
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
