import gql from 'graphql-tag'

export const test = 'transpositions can be ordered by a statistic'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        transpose(
          keys: ["alpha", "beta"]
          asKey: "greek"
          orderByStatistic: {method: "min", column: "greek", descending: true}
        ) {
          label
          node { leaf }
        }
      }
      top {
        variable(key: "greek") {
          min: statistic(method: "min") {
            method
            leaf
          }
          max: statistic(method: "max") {
            method
            leaf
          }
        }
      }
      rows {
        cells {
          detransposed 
          agg
          value 
        } 
      }
    }
  }
`

// partial match
export const output = {
  table: {
    left: {
      transpose: [
        {
          label: "beta",
        },
        {
          label: "alpha",
        }
      ]
    },
    top: {
      variable: {
        min: {
          method: "min",
        },
        max: {
          method: "max",
        }
      }
    },
    rows: [
      {
        cells: [
          {
            detransposed: "beta",
            agg: "min",
            value: "1"
          },
          {
            detransposed: "beta",
            agg: "max",
            value: "9"
          }
        ]
      },
      {
        cells: [
          {
            detransposed: "alpha",
            agg: "min",
            value: "0.2"
          },
          {
            detransposed: "alpha",
            agg: "max",
            value: "9.9"
          }
        ]
      },
    ]
  }
}

