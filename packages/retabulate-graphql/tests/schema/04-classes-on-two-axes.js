import gql from 'graphql-tag'

export const test = 'groups data on two axes, calculates intersections'

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
        classes(key: "subcat") {
          label
          variable(key: "beta") {
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
    left: {
      classes: [
        {
          label: "a",
        },
        {
          label: "b",
        }
      ]
    },
    top: {
      classes: [
        {
          label: "w",
          variable: {
            n: {
              method: "n"
            }
          }
        },
        {
          label: "x",
          variable: {
            n: {
              method: "n"
            }
          }
        },
        {
          label: "y",
          variable: {
            n: {
              method: "n"
            }
          }
        },
        {
          label: "z",
          variable: {
            n: {
              method: "n"
            }
          }
        }
      ]
    },
    rows: [
      {
        cells: [
          {
            value: "1"
          },
          {
            value: "2"
          },
          {
            value: "1"
          },
          {
            value: "0"
          }
        ]
      },
      {
        cells: [
          {
            value: "0"
          },
          {
            value: "0"
          },
          {
            value: "2"
          },
          {
            value: "2"
          }
        ]
      }
    ]
  }
}