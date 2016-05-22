var Utils = require('./utils')
var _ = require('lodash')

function getInitialSymbol(grammar) {
  return _.keys(grammar)[0]
}

function getNonTerminals(grammar) {
  return _.keys(grammar)
}

function getTerminals(grammar) {
  return _(grammar)
    .values()
    .flatten()
    .map(s => s.split(''))
    .flatten()
    .filter(s => Utils.isTerminal(s))
    .uniq()
    .value()
}

function getRepresentation(grammar) {
  var initialSymbol = getInitialSymbol(grammar)
  var nonTerminals = getNonTerminals(grammar).join(', ')
  var terminals = getTerminals(grammar).join(', ')
  var productions = _.map(Utils.emptyToEpsilon(grammar), (r, l) =>
    '  ' + l + ' -> ' + r.join(' | ')).join('\n')

  var str = 'G = ({' + nonTerminals + '}, {' + terminals + '}, P, ' + initialSymbol + ')'
  str += '\nP = {\n' + productions + '\n}'

  return str
}

function isLeftFactored(grammar) {
  return _.every(grammar, (rightSide, leftSide) => {
    var firstSymbols = _.map(rightSide, e => e[0])
    return _.uniq(firstSymbols).length === rightSide.length
  })
}

function isLeftRecursive(grammar) {
  return _.some(grammar, (rightSide, leftSide) => {
    return _.some(rightSide, e => e[0] === leftSide)
  })
}

module.exports = {
  getInitialSymbol, getInitialSymbol,
  getNonTerminals: getNonTerminals,
  getTerminals: getTerminals,
  getRepresentation: getRepresentation,
  isLeftFactored: isLeftFactored,
  isLeftRecursive: isLeftRecursive
}
