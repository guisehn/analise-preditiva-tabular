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
  
  var indexes = [];

  function getSymbolPositions(stringProduction, symbol){
    for(var i=0; i<stringProduction.length;i++) {
        if (stringProduction[i] === symbol) {
          indexes.push(i);
        }
    }
    return [indexes]
  }

  _.forEach(grammar.productionSet, (rightSide, leftSide) => {
    _.forEach(rightSide, production => {
      var symbolIndex = production.indexOf(symbol)

      if (symbolIndex === -1) {
        return
      }
      
      for (var i = symbolIndex; i < production.length; i++) {
        var next = production[i + 1]
        
        // se é final da produção, inclui follow do lado esquerdo
        if (next === undefined) {
          // checagem para evitar recursão infinita
          if (!_.includes(history, leftSide)) {
            followSet = followSet.concat(getFollowSet(grammar, leftSide, history))
          }

          break
        }

        // adiciona first do próximo símbolo ao follow set
        var first = _.map(FirstSetFinder.getFirstSet(grammar, next), 'symbol')
        followSet = followSet.concat(first.filter(s => s !== ''))

        // testa próximo símbolo apenas se conjunto first
        // possui sentença vazia
        if (!_.includes(first, '')) {
          break
        }
      }
    })
  })

  return _.uniq(followSet)
}

function getFollowSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getFollowSet(grammar, leftSide))
}

module.exports = {
  getFollowSet: getFollowSet,
  getFollowSets: getFollowSets
}
