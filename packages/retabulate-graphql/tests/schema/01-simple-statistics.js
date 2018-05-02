import gql from 'graphql-tag'

export const test = 'computes simple global statistics'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        variable(key: "beta") {
          n: statistic(method: "n") {
            leaf
          }
          sum: statistic(method: "sum") {
            leaf
          }
        }
      }
      top { all { leaf } }
      rows { cells { value } }
    }
  }
`

// partial match
export const output = {
  table: {
    rows: [
      {
        // cell 0,0
        cells: [{
          value: '8'
        }]
      },
      {
        // cell 1,0
        cells: [{
          value: '33'
        }]
      }
    ]
  }
}