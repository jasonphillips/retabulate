import gql from 'graphql-tag'

export const test = 'percentages can specify denominator with "over"'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "category") {
          label
          node {
            leaf
          }
        }
      }
      top {
        variable(key: "beta") {
          pctn: statistic(method: "pctn", over: "category") {
            leaf
          }
          pctsum: statistic(method: "pctsum", over: "category") {
            leaf
          }
        }
      }
      rows { cells { value } }
    }
  }
`

// partial match: check serialized data
export const output = {
  table: {
    rows: [
      {
        cells: [
          {
            value: "50",
          },
          {
            value: JSON.stringify( 14 / 33 * 100 )
          },
        ]
      },
      {
        cells: [
          {
            value: "50",
          },
          {
            value: JSON.stringify( 19 / 33 * 100 )
          }
        ]
      }
    ]
  }
}