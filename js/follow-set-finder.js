'use strict'

var Utils = require('./utils')
var FirstSetFinder = require('./first-set-finder')
var _ = require('lodash')

function getFollowSet(grammar, symbol, history) {
  // TO-DO: implementar regra pra calcular o follow aqui
  return ['TO-DO']
}

function getFollowSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getFollowSet(grammar, leftSide))
}

module.exports = {
  getFollowSet: getFollowSet,
  getFollowSets: getFollowSets
}
