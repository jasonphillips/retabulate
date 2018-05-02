import gql from 'graphql-tag'

export const test = 'filters variable columns by values'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        all {
          leaf
        }
      }
      top {
        variable(key: "beta") {
          just_zeros: value(value: "0") {
            n: statistic(method: "n") {
              method
              leaf
            }
          }
          ones_zeros: value(values: ["0", "1"]) {
            n: statistic(method: "n") {
              method
              leaf
            }
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
    top: {
      variable: {
        just_zeros: {
          n: {
            method: "n",
          }
        },
        ones_zeros: {
          n: {
            method: "n",
          }
        }
      }
    },
    rows: [
      {
        cells: [
          {
            value: "1"
          },
          {
            value: "3"
          }
        ]
      }
    ]
  }
}