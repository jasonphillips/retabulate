import gql from 'graphql-tag'

export const test = 'Loads dataset via context, correctly counts records'

export const query = gql`
  query tabulate {
    table(set: "test") {
      length
    }
  }
`

export const output = {
  table: {
    length: 10
  }
}