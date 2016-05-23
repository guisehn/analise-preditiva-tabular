'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function getPredictiveSet(grammar, symbol, history) {
  return ['a', 'b', 'c']
}

function getPredictiveSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getPredictiveSet(grammar, leftSide))
}

module.exports = {
  getPredictiveSet: getPredictiveSet,
  getPredictiveSets: getPredictiveSets
}