import gql from 'graphql-tag'

export const test = 'make nested divisions into data classes on single axis'

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
          n: statistic(method: "n") {
            leaf
          }
        }
      }
      rows { cells { value } }
    }
  }
`

// partial match
export const output = {
  table: {
    left: {
      classes: [
        // expect a, b groupings in order
        {
          label: "a",
        },
        {
          label: "b",
        }
      ]
    },
    rows: [
      // check group counts
      {
        cells: [
          {
            value: "4"
          }
        ]
      },
      {
        cells: [
          {
            value: "4"
          }
        ]
      }
    ]
  }
}