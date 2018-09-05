import { graphql } from 'graphql'
import gql from 'graphql-tag'
import schema, { makeLocalExecution } from '../src/'

import fs from 'fs'
import { basename, extname, resolve } from 'path'

const dataset = [
  {category: 'a', catorder: 2, subcat: 'w', alpha: 3.2, beta: 5, delimed: 'y'},
  {category: 'a', catorder: 2, subcat: 'x', alpha: 8.2, beta: 8, delimed: 'y,u'},
  {category: 'a', catorder: 2, subcat: 'x', alpha: 3.1, beta: 1, delimed: 'i'},
  {category: 'a', catorder: 2, subcat: 'y', alpha: 2.1, beta: 0, delimed: 'y,u,i'},
  {category: 'b', catorder: 1, subcat: 'y', alpha: 5.5, beta: 9, delimed: 'i'},
  {category: 'b', catorder: 1, subcat: 'y', alpha: 9.9, beta: 1, delimed: 'i'},
  {category: 'b', catorder: 1, subcat: 'z', alpha: 0.2, beta: 2, delimed: 'y'},
  {category: 'b', catorder: 1, subcat: 'z', alpha: 3.2, beta: 7, delimed: 'y,i'},
  // final rows test that undefined, null values 
  // do not get counted in the 'n' statistic
  {category: 'b', catorder: 1, subcat: 'z', alpha: 3.0, beta: undefined, delimed: null},
  {category: 'b', catorder: 1, subcat: 'z', alpha: 3.0, beta: null, delimed: 'y,i'},
]

const datasets = { test: dataset }
const getDataset = name => datasets[name] 
  ? Promise.resolve(datasets[name]) 
  : Promise.reject('not found')

let execute

const log = d => console.log(JSON.stringify(d, null, 2))

describe('retabulate schema', function () {
  beforeEach(() => {
    execute = makeLocalExecution({ getDataset })
  })

  const dir = resolve(__dirname, './schema')
  const tests = fs
    .readdirSync(dir)
    .filter(t => t[0] != '.')
    .map(t => basename(t, extname(t)))

  const testData = tests.map(testFile => {
    return require(resolve(dir, testFile))
  })

  testData.map(({ test, query, output, retabulateOptions = {} }) => { 
    it(test, done => {
      execute(query, { context: { retabulateOptions } })
        .then(data => {
          // log(data)
          expect(data).toMatchObject(output)
          done()
        })
        .catch(e => console.log(e))
    })
  })
})
