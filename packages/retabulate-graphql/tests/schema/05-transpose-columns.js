import gql from 'graphql-tag'

export const test = 'transposes multiple columns as single variable for other axis'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        transpose(keys: ["alpha", "beta"], asKey: "greek") {
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
          label: "alpha",
        },
        {
          label: "beta",
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
      }
    ]
  }
}

