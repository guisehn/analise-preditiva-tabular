'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function isLeftFactored(grammar) {
  return _.every(grammar.productionSet, (rightSide, leftSide) => {
    var firstSymbols = _.map(rightSide, e => e[0])
    return _.uniq(firstSymbols).length === rightSide.length
  })
}

function isLeftRecursive(grammar) {
  return _.some(grammar.productionSet, (rightSide, leftSide) => {
    return _.some(rightSide, e => e[0] === leftSide)
  })
}

module.exports = {
  isLeftFactored: isLeftFactored,
  isLeftRecursive: isLeftRecursive
}
