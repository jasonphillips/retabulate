import gql from 'graphql-tag'

export const test = 'cells contain query data, exposing their filters'

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

// partial match
export const output = {
  table: {
    rows: [
      {
        cells: [
          {
            value: "1",
            queries: [
              {
                key: "category",
                values: ["a"]
              },
              {
                key: "subcat",
                values: ["w"]
              }
            ]
          },
          {
            value: "2",
            queries: [
              {
                key: "category",
                values: ["a"]
              },
              {
                key: "subcat",
                values: ["x"]
              }
            ]
          },
          {
            value: "1",
            queries: [
              {
                key: "category",
                values: ["a"]
              },
              {
                key: "subcat",
                values: ["y"]
              }
            ]
          },
          {
            value: "0",
            queries: [
              {
                key: "category",
                values: ["a"]
              },
              {
                key: "subcat",
                values: ["z"]
              }
            ]
          }
        ]
      },
      {
        cells: [
          {
            value: "0",
            queries: [
              {
                key: "category",
                values: ["b"]
              },
              {
                key: "subcat",
                values: ["w"]
              }
            ]
          },
          {
            value: "0",
            queries: [
              {
                key: "category",
                values: ["b"]
              },
              {
                key: "subcat",
                values: ["x"]
              }
            ]
          },
          {
            value: "2",
            queries: [
              {
                key: "category",
                values: ["b"]
              },
              {
                key: "subcat",
                values: ["y"]
              }
            ]
          },
          {
            value: "2",
            queries: [
              {
                key: "category",
                values: ["b"]
              },
              {
                key: "subcat",
                values: ["z"]
              }
            ]
          }
        ]
      }
    ]
  }
}