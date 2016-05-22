'use strict'

var Utils = require('./utils')
var FirstSetFinder = require('./first-set-finder')
var _ = require('lodash')

function getFollowSet(grammar, symbol, history) {
  if (Utils.isTerminal(symbol)) {
    return [symbol]
  }

  var followSet = []
  history = history ? history.concat(symbol) : [symbol]

  if (symbol === grammar.startSymbol) {
    followSet.push('$')
  }

  _.forEach(grammar.productionSet, (rightSide, leftSide) => {
    _.forEach(rightSide, production => {
      var index = production.indexOf(symbol)

      if (index === -1) {
        return
      }

      var next = production[index + 1]

      // se é final da produção, pega follow do lado esquerdo
      if (next === undefined) {
        //followSet = followSet.concat(getFollowSet())
      } else {
        var firsts = FirstSetFinder.getFirstSet(grammar, next)
        followSet = followSet.concat(firsts)
      }
    })
  })

  return followSet
}

function getFollowSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getFollowSet(grammar, leftSide))
}

module.exports = {
  getFollowSet: getFollowSet,
  getFollowSets: getFollowSets
}
