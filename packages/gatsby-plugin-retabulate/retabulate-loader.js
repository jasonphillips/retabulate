const processTabulations = require('./process')

module.exports = function (contents) {
  return processTabulations(this.resourcePath, contents)
}
