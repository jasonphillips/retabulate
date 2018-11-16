import gql from 'graphql-tag'

export const test = 'orders groupings on axis by provided statistic'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "subcat", orderByStatistic: {column: "beta", method: "sum"}) {
          label
          node {
            leaf
          }
        }
      }
      top {
        variable(key: "beta") {
          sum: statistic(method: "sum") {
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
        // ascending should be default
        {
          label: "w",
        },
        {
          label: "x",
        },
        {
          label: "z",
        },
        {
          label: "y",
        }
      ]
    },
    rows: [
      // check group counts; note that only 2 of "z" class since variable is null
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
            value: "9"
          }
        ]
      },
      {
        cells: [
          {
            value: "9"
          }
        ]
      },
      {
        cells: [
          {
            value: "10"
          }
        ]
      }
    ]
  }
}