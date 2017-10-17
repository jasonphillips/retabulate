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
    classes(
      key:String, 
      all:String, 
      total:String, 
      orderBy:String, 
      renderId:String, 
      mapping:[GroupMap],
      ordering: [String],
    ): [Axis]
    transpose(keys:[String], asKey:String, renderId:String): [Axis]
    all(label:String, renderId:String): Axis
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
    aggregation(
      method:String, 
      methods:[String], 
      diff: Condition,
      format:String, 
      over:String, 
      renderId:String
    ): Aggregation
    statistic(
      method:String, 
      methods:[String], 
      diff: Condition,
      format:String, 
      over:String, 
      renderId:String
    ): Aggregation
    value(value: String, values: [String], renderId: String): Variable
    all(label:String, renderId:String): Variable
    label: String
    leaf: ID
    node: Node
  }

  type Aggregation {
    method: String
    methods: [String]
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
    values: [String]
  }

  input GroupMap {
    label: String!
    values: [String]
  }

  type Query {
    table(set: String, where: [Condition]): Table
  }
`
