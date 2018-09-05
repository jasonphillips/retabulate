import gql from 'graphql-tag'

export const test = 'splits a column by provided delimiter'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "delimed", delimiter: ",") {
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
        // expect y, u, i groupings split out of delimited field
        {
          label: "y",
        },
        {
          label: "u",
        },
        {
          label: "i",
        }
      ]
    },
    rows: [
      // check group counts
      {
        cells: [
          {
            value: "5"
          }
        ]
      },
      {
        cells: [
          {
            value: "2"
          }
        ]
      },
      {
        cells: [
          {
            value: "5"
          }
        ]
      }
    ]
  }
}