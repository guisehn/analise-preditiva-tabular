'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function First(symbol, productions) {
  this.symbol = symbol
  this.productions = productions || []
}

First.prototype.toString = function() {
  return this.symbol || 'ε'
}

function getFirstSet(grammar, symbol, history) {
  if (Utils.isTerminal(symbol)) {
    return [new First(symbol)]
  }

  history = history ? history.concat(symbol) : [symbol]

  var firsts = (grammar.productionSet[symbol] || []).map(e => {
    var firsts = []

    // condição especial pra sentença vazia
    if (e === '') {
      return [new First('', [e])]
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
        firsts.push(_.filter(first, s => s.symbol !== ''))
      } else {
        firsts.push(first)
      }

      // testa próximo símbolo apenas se conjunto first
      // possui sentença vazia
      if (!_.includes(_.map(first, 'symbol'), '')) {
        break
      }
    }

    return _.flatten(firsts).map(first => {
      first.productions = [e]
      return first
    })
  })

  firsts = _(firsts).flatten().value()

  return mergeDuplicates(firsts)
}

function mergeDuplicates(list) {
  var firstsBySymbol = _.groupBy(list, 'symbol')

  return _.map(firstsBySymbol, (firsts, symbol) => {
    var productions = _(firsts).map(f => f.productions).flatten().uniq().value()
    return new First(symbol, productions)
  })
}

function getFirstSets(grammar) {
  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getFirstSet(grammar, leftSide))
}

module.exports = {
  getFirstSet: getFirstSet,
  getFirstSets: getFirstSets
}
