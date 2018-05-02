import gql from 'graphql-tag'

export const test = 'renderIds flow down into child headers, cells'

export const query = gql`
  query tabulate {
    table(set: "test") {
      left {
        category: classes(key: "category", renderId: "by-cat") {
          label
          renderIds
          leaf
        }
        header_a: all(key: "subcat", renderId: "h-a") {
          renderIds
          header_b: all(renderId: "h-b") {
            renderIds
            leaf
          }
        }
      }
      top {
        variable(key: "beta", renderId: "var-beta") {
          min: statistic(method: "min", renderId: "min") {
            method
            renderIds
            leaf
          }
          max: statistic(method: "max", renderId: "max") {
            method
            renderIds
            leaf
          }
        }
      }
      rows {
        cells {
          agg
          value 
          renderIds
        } 
      }
    }
  }
`

// partial match
export const output = {
  table: {
    left: {
      category: [
        {
          label: "a", renderIds: ["by-cat"],
        },
        {
          label: "b", renderIds: ["by-cat"],
        }
      ],
      header_a: {
        renderIds: ["h-a"],
        header_b: {
          renderIds: ["h-a", "h-b"],
        }
      }
    },
    top: {
      variable: {
        min: {
          method: "min", renderIds: ["var-beta", "min"],
        },
        max: {
          method: "max", renderIds: ["var-beta", "max"],
        }
      }
    },
    rows: [
      {
        cells: [
          {
            agg: "min", value: "1", renderIds: ["var-beta", "min", "by-cat"]
          },
          {
            agg: "max", value: "8", renderIds: ["var-beta", "max", "by-cat"]
          }
        ]
      },
      {
        cells: [
          {
            agg: "min", value: "1", renderIds: ["var-beta", "min", "by-cat"]
          },
          {
            agg: "max", value: "9", renderIds: ["var-beta", "max", "by-cat"]
          }
        ]
      },
      {
        cells: [
          {
            agg: "min", value: "1", renderIds: ["var-beta", "min", "h-a", "h-b"]
          },
          {
            agg: "max", value: "9", renderIds: ["var-beta", "max", "h-a", "h-b"]
          }
        ]
      }
    ]
  }
}