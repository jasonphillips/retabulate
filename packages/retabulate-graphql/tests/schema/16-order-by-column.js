import gql from 'graphql-tag'

export const test = 'orders groupings on axis by provided orderBy column'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "category", orderBy: "catorder") {
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
        // expect b, a order, as expected from 'catorder' column
        {
          label: "b",
        },
        {
          label: "a",
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