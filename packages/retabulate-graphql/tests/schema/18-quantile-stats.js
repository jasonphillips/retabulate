import gql from 'graphql-tag'

export const test = 'calculate 1st quartile, mean, 3rd quartile correctly'

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
          q1: statistic(method: "quartile1") {
            leaf
          }
          q2: statistic(method: "median") {
            leaf
          }
          q3: statistic(method: "quartile3") {
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
      // check quartiles
      {
        cells: [
          {
            // a q1
            value: "0.75"
          },
          {
            // a q2
            value: "3"
          },
          {
            // a q3
            value: "5.75"
          }
        ]
      },
      {
        cells: [
          {
            // b q1
            value: "1.75"
          },
          {
            // b q2
            value: "4.5"
          },
          {
            // b q3
            value: "7.5"
          }
        ]
      }
    ]
  }
}