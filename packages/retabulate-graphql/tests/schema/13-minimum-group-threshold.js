import gql from 'graphql-tag'

export const test = 'retabulateOptions.minimum permits groups to be excluded if under a minimum threshold'

export const retabulateOptions = {
  minimum: 3,
}

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        # these classes will all pass the minimum 3
        classes(key: "category") {
          label
          # only 'z' should pass this under group 'b'
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
      rows { cells { value redacted } }
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
            { label: "(none)" },
          ]
        },
        {
          label: "b",
          classes: [
            { label: "z" },
          ]
        }
      ]
    },
    rows: [
      // verify counts
      {
        cells: [
          { value: "0" },
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