import gql from 'graphql-tag'

export const test = 'diff sends group total comparison to cell values'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        classes(key: "subcat") {
          label
          node {
            leaf
          }
        }
      }
      top {
        variable(key: "beta") {
          compare_to_all: statistic(method: "n", diff: {key: "subcat"}) {
            leaf
          }
          compare_to_x: statistic(method: "n", diff: {key: "subcat", values: ["x"]}) {
            leaf
          }
        }
      }
      rows {
        cells {
          value 
          queries {
            key
            values
          }
        } 
      }
    }
  }
`

// check that values contain {group value, diff value} (serialized)
export const output = {
  table: {
    rows: [
      {
        cells: [
          {
            value: JSON.stringify({ group: 1, diff: 8 }),
            queries: [{ key: "subcat", values: ["w"]}],
          },
          {
            value: JSON.stringify({ group: 1, diff: 2 }),
            queries: [{ key: "subcat", values: ["w"]}],
          },
        ]
      },
      {
        cells: [
          {
            value: JSON.stringify({ group: 2, diff: 8 }),
            queries: [{ key: "subcat", values: ["x"]}],
          },
          {
            value: JSON.stringify({ group: 2, diff: 2 }),
            queries: [{ key: "subcat", values: ["x"]}],
          },
        ]
      },
      {
        cells: [
          {
            value: JSON.stringify({ group: 3, diff: 8 }),
            queries: [{ key: "subcat", values: ["y"]}],
          },
          {
            value: JSON.stringify({ group: 3, diff: 2 }),
            queries: [{ key: "subcat", values: ["y"]}],
          },
        ]
      },
      {
        cells: [
          {
            value: JSON.stringify({ group: 2, diff: 8 }),
            queries: [{ key: "subcat", values: ["z"]}],
          },
          {
            value: JSON.stringify({ group: 2, diff: 2 }),
            queries: [{ key: "subcat", values: ["z"]}],
          },
        ]
      }
    ]
  }
}