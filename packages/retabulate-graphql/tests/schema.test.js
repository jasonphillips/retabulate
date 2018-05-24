import { graphql } from 'graphql'
import gql from 'graphql-tag'
import schema, { makeLocalExecution } from '../src/'

import fs from 'fs'
import { basename, extname, resolve } from 'path'

const dataset = [
  {category: 'a', subcat: 'w', alpha: 3.2, beta: 5},
  {category: 'a', subcat: 'x', alpha: 8.2, beta: 8},
  {category: 'a', subcat: 'x', alpha: 3.1, beta: 1},
  {category: 'a', subcat: 'y', alpha: 2.1, beta: 0},
  {category: 'b', subcat: 'y', alpha: 5.5, beta: 9},
  {category: 'b', subcat: 'y', alpha: 9.9, beta: 1},
  {category: 'b', subcat: 'z', alpha: 0.2, beta: 2},
  {category: 'b', subcat: 'z', alpha: 3.2, beta: 7},
  // final rows test that undefined, null values 
  // do not get counted in the 'n' statistic
  {category: 'b', subcat: 'z', alpha: 3.0, beta: undefined},
  {category: 'b', subcat: 'z', alpha: 3.0, beta: null},
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

  testData.map(({ test, query, output }) => { 
    it(test, done => {
      execute(query, {})
        .then(data => {
          // log(data)
          expect(data).toMatchObject(output)
          done()
        })
        .catch(e => console.log(e))
    })
  })
})
