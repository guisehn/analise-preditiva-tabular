'use strict'

var Utils = require('./utils')
var FirstSetFinder = require('./first-set-finder')
var FollowSetFinder = require('./follow-set-finder')
var _ = require('lodash')

function getParsingRow(grammar, firstSets, followSets, symbol) {
  var terminals = grammar.getTerminals().concat(['$', 'ε'])
  var row = {}

  terminals.forEach(t => {
    row[t] = ['TO-DO'] // to-do
  })

  return row
}

function getParsingTable(grammar) {
  var firstSets = FirstSetFinder.getFirstSets(grammar);
  var followSets = FollowSetFinder.getFollowSets(grammar);

  return _.mapValues(grammar.productionSet,
    (rightSide, leftSide) => getParsingRow(grammar, firstSets, followSets, leftSide))
}

module.exports = {
  getParsingTable: getParsingTable
}
