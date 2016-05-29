'use strict'

var _ = require('lodash')

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
  if (_.isArray(object)) {
    return object.map(e => emptyToEpsilon(e))
  } else if (_.isObject(object)) {
    return _.mapValues(object, e => emptyToEpsilon(e))
  } else {
    return object === '' ? 'ε' : object
  }
}

module.exports = {
  isTerminal: isTerminal,
  isNonTerminal: isNonTerminal,
  containsTerminal: containsTerminal,
  containsNonTerminal: containsNonTerminal,
  emptyToEpsilon: emptyToEpsilon
}
