import gql from 'graphql-tag'

export const test = 'multiple stat methods can be serialized in cells'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        variable(key: "beta") {
          sum_n: statistic(methods: ["sum", "n"]) {
            leaf
          }
        }
      }
      top { all { leaf } }
      rows {
        cells {
          agg
          value
        } 
      }
    }
  }
`

// partial match
export const output = {
  table: {
    rows: [
      {
        cells: [{
          "agg": "sum,n",
          // mutli-values are always serialized
          "value": JSON.stringify({sum: 33, n: 8})
        }]
      },
    ]
  }
}