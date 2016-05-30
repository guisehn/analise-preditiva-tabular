'use strict'

var _ = require('lodash')
var expect = require('chai').expect
var Grammar = require('../js/grammar')
var FollowSetFinder = require('../js/follow-set-finder')

var tests = [

  {
    grammar: new Grammar('A', {
      A: ['Bb', 'b', 'c', 'd'],
      B: ['f', '']
    }),

    follows: {
      A: ['$'],
      B: ['b'],
    }
  },

  {
    grammar: new Grammar('S', {
      S: ['ABCDE'],
      A: ['a', ''],
      B: ['b', ''],
      C: ['c'],
      D: ['d', ''],
      E: ['e', '']
    }),

    follows: {
      S: ['$'],
      A: ['b', 'c'],
      B: ['c'],
      C: ['d', 'e', '$'],
      D: ['e', '$'],
      E: ['$']
    }
  },

  {
    grammar: new Grammar('E', {
      E: ['TZ'],
      Z: ['+TZ', ''],
      T: ['FY'],
      Y: ['*FY', ''],
      F: ['i', '(E)'],
    }),

    follows: {
      E: ['$', ')'],
      Z: ['$', ')'],
      T: ['+', '$', ')'],
      Y: ['+', '$', ')'],
      F: ['*', '+', '$', ')']
    }
  },

  {
    grammar: new Grammar('S', {
      S: ['ACB', 'CbB', 'Ba'],
      A: ['da', 'BC'],
      B: ['g', ''],
      C: ['h', '']
    }),

    follows: {
      S: ['$'],
      A: ['g', 'h', '$'],
      B: ['a', 'g', 'h', '$'],
      C: ['b', 'g', 'h', '$']
    }
  },

  {
    grammar: new Grammar('S', {
      S: ['AaAbAc'],
      A: ['x']
    }),

    follows: {
      S: ['$'],
      A: ['a', 'b', 'c']
    }
  }
]

function adjustForComparison(list) {
  return _.sortBy(list)
}

describe('FollowSetFinder', () => {

  describe('#getFollowSet()', () => {
    _.forEach(tests, (test, i) => {
      describe('Grammar ' + (i + 1), () => {
        _.forEach(test.follows, (followSet, symbol) => {
          it('should calculate follow set correctly for symbol ' + symbol, () => {
            var calculated = adjustForComparison(FollowSetFinder.getFollowSet(test.grammar, symbol))
            followSet = adjustForComparison(followSet)

            expect(followSet).to.deep.equal(calculated)
          })
        })
      })
    })
  })

  describe('#getFollowSets()', () => {
    _.forEach(tests, (test, i) => {
      describe('Grammar ' + (i + 1), () => {
        it('should calculate follow sets correctly', () => {
          var calculated = FollowSetFinder.getFollowSets(test.grammar)
          calculated = _.mapValues(calculated, c => adjustForComparison(c))

          var followSets = _.mapValues(test.follows, c => adjustForComparison(c))

          expect(followSets).to.deep.equal(calculated)
        })
      })
    })
  })

})
