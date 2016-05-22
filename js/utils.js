function isNonTerminal(symbol) {
  return /^[A-Z]$/.test(symbol)
}

function isTerminal(symbol) {
  return !isNonTerminal(symbol)
}

function containsNonTerminal(symbols) {
  return /[A-Z]/.test(symbols)
}

function containsTerminal(symbols) {
  return /[^A-Z]/.test(symbols)
}

function emptyToEpsilon(object) {
  return _.mapValues(object, e => e.map(e => e === '' ? 'ε' : e))
}

module.exports = {
  isTerminal: isTerminal,
  isNonTerminal: isNonTerminal,
  containsTerminal: containsTerminal,
  containsNonTerminal: containsNonTerminal,
  emptyToEpsilon: emptyToEpsilon
}
