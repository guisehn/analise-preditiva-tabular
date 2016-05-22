'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function getFirstSet(grammar, symbol, history) {
  if (Utils.isTerminal(symbol)) {
    return [symbol]
  }

  history = history ? history.concat(symbol) : [symbol]

  var firsts = (grammar.productionSet[symbol] || []).map(e => {
    var firsts = []

    // condição especial pra sentença vazia
    if (e === '') {
      return ['']
    }

    for (var i = 0; i < e.length; i++) {
      var s = e[i]

      // impede recursão infinita
      if (_.includes(history, s)) {
        break
      }

      var first = getFirstSet(grammar, s, history)

      // filtra sentença vazia se não estamos na última posição
      if (i + 1 < e.length) {
        firsts.push(_.filter(first, s => s !== ''))
      } else {
        firsts.push(first)
      }

      // testa próximo símbolo apenas se conjunto first
      // possui sentença vazia
      if (!_.includes(first, '')) {
        break
      }
    }

    return _.flatten(firsts)
  })

  return _(firsts).flatten().uniq().value()
}

function getFirstSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getFirstSet(grammar, leftSide))
}

module.exports = {
  getFirstSet: getFirstSet,
  getFirstSets: getFirstSets
}
