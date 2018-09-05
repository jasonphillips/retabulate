import gql from 'graphql-tag'

export const test = 'orders groupings on axis by number of records'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "subcat", orderBy: "_DESC") {
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
        // _DESC should order by count in reverse
        {
          label: "z",
        },
        {
          label: "y",
        },
        {
          label: "x",
        },
        {
          label: "w",
        }
      ]
    },
    rows: [
      // check group counts; note that only 2 of "z" class since variable is null
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
            value: "3"
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
            value: "1"
          }
        ]
      }
    ]
  }
}