import gql from "graphql-tag"

export const test = "allows groups / classes to be explicitly mapped into labels"

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(
          key: "category"
          mapping: [
            { label: "ab", values: ["a","b"] },
            # "c" doesnt exist in data; test that it emerges w/ 0
            { label: "nonexistent", values: ["c"] },
          ]
        ) {
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
        // expect ab grouped together
        {
          label: "ab",
        },
        // expect nonexistent group of 'c' to be here, though empty
        {
          label: "nonexistent",
        }
      ]
    },
    rows: [
      // check group counts
      {
        cells: [
          {
            value: "8"
          }
        ]
      },
      {
        cells: [
          {
            value: "0"
          }
        ]
      }
    ]
  }
}