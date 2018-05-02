import gql from 'graphql-tag'

export const test = 'groups data on an axis by key, computes stats'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "category") {
          label
          classes(key: "subcat") {
            label
            node {
              leaf
            }
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
        // verify order, groupings
        {
          label: "a",
          classes: [
            { label: "w" },
            { label: "x" },
            { label: "y" },
          ]
        },
        {
          label: "b",
          classes: [
            { label: "y" },
            { label: "z" },
          ]
        }
      ]
    },
    rows: [
      // verify counts
      {
        cells: [
          { value: "1" },
        ]
      },
      {
        cells: [
          { value: "2" },
        ]
      },
      {
        cells: [
          { value: "1" },
        ]
      },
      {
        cells: [
          { value: "2" },
        ]
      },
      {
        cells: [
          { value: "2" },
        ]
      }
    ]
  }
}