var Utils = require('./utils')
var _ = require('lodash')

function extractPairs(str) {
  return str
    .trim()
    .split('\n')
    .map(l => l.replace(/\s/g, ''))
    .map(l => l.split(':'))
    .map(l => [l[0], l.slice(1).join(':').split('|')])
}

function validateDuplicatesOnLeft(pairs) {
  var lefts = _.map(pairs, '0')

  if (lefts.length !== _.uniq(lefts).length) {
    throw new Error('Gramática possui lados esquerdos multiplamente definidos.')
  }
}

function validateMissingNonTerminals(pairs) {
  _.forEach(pairs, (pair, n) => {
    n++

    _.forEach(pair[1], symbols => {
      _.forEach(symbols, symbol => {
        if (Utils.isNonTerminal(symbol) && !_.find(pairs, pair => pair[0] === symbol)) {
          throw new Error('Símbolo ' + symbol + ' referenciado no lado direito da'
            + ' linha ' + n + ' não encontrado nas regras de produções.')
        }
      })
    })
  })
}

function validatePairs(pairs) {
  _.forEach(pairs, (pair, n) => {
    n++

    if (pair[0] === '') {
      throw new Error('Lado esquerdo não encontrado na linha ' + n + '.')
    }

    if (pair[0].length > 1) {
      throw new Error('A gramática deve ser GLC.'
        + ' Múltiplos símbolos à esquerda foram encontrados na linha ' + n + '.')
    }

    if (Utils.containsTerminal(pair[0])) {
      throw new Error('Símbolo terminal encontrado à esquerda na linha ' + n + '.')
    }

    if (pair.length !== 2) {
      throw new Error('Separador faltando na linha ' + n + '.')
    }
  })
}

function pairsToObject(pairs) {
  return _(pairs)
    .groupBy('0')
    .mapValues(l => l[0][1])
    .value()
}

function parse(str) {
  var pairs = extractPairs(str)

  validatePairs(pairs)
  validateDuplicatesOnLeft(pairs)
  validateMissingNonTerminals(pairs)

  return pairsToObject(pairs)
}

module.exports = {
  parse: parse
}
