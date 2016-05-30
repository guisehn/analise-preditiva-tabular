'use strict'

var Utils = require('./utils')
var FirstSetFinder = require('./first-set-finder')
var FollowSetFinder = require('./follow-set-finder')
var _ = require('lodash')

function getParsingRow(grammar, firstSets, followSets, symbol) {
  var terminals = grammar.getTerminals().concat(['$'])
  var row = {}

  terminals.forEach(t => {
    var first = _.find(firstSets[symbol], { symbol: t })
    row[t] = _.get(first, 'productions', [])
  })

  // se contém sentença vazia no conjunto de produções, cria items do follow
  if (_.includes(grammar.productionSet[symbol], '')) {
    followSets[symbol].forEach(s => {
      row[s] = row[s].concat('')
    })
  }

  return row
}

function getParsingTable(grammar) {
  var firstSets = FirstSetFinder.getFirstSets(grammar);
  var followSets = FollowSetFinder.getFollowSets(grammar);

  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getParsingRow(grammar, firstSets, followSets, leftSide))
}

function checkMultipleEntries(parsingTable) {
  return _.some(parsingTable, x => _.some(x, y => y.length > 1))
}

module.exports = {
  getParsingTable: getParsingTable,
  checkMultipleEntries: checkMultipleEntries
}
