'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function Grammar(startSymbol, productionSet) {
  this.startSymbol = startSymbol
  this.productionSet = productionSet
}

Grammar.prototype.getNonTerminals = function() {
  return _.keys(this.productionSet)
}

Grammar.prototype.getTerminals = function() {
  return _(this.productionSet)
    .values()
    .flatten()
    .map(s => s.split(''))
    .flatten()
    .filter(s => Utils.isTerminal(s))
    .uniq()
    .value()
}

Grammar.prototype.getRepresentation = function() {
  var nonTerminals = this.getNonTerminals().join(', ')
  var terminals = this.getTerminals().join(', ')
  var productionSet = _.map(Utils.emptyToEpsilon(this.productionSet),
    (right, left) => '  ' + left + ' → ' + right.join(' | ')).join('\n')

  var str = 'G = ({' + nonTerminals + '}, {' + terminals + '}, P, ' + this.startSymbol + ')'
  str += '\nP = {\n' + productionSet + '\n}'

  return str
}

module.exports = Grammar
