'use strict'

var _ = require('lodash')
var expect = require('chai').expect
var Grammar = require('../js/grammar')
var FirstSetFinder = require('../js/first-set-finder')

var tests = [

  {
    grammar: new Grammar('A', {
      A: ['Bb', 'b', 'c', 'd'],
      B: ['f', '']
    }),

    firsts: {
      A: [
        { symbol: 'b', productions: ['Bb', 'b'] },
        { symbol: 'c', productions: ['c'] },
        { symbol: 'd', productions: ['d'] },
        { symbol: 'f', productions: ['Bb'] },
      ],

      B: [
        { symbol: '', productions: [''] },
        { symbol: 'f', productions: ['f'] }
      ]
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

    firsts: {
      S: [
        { symbol: 'a', productions: ['ABCDE'] },
        { symbol: 'b', productions: ['ABCDE'] },
        { symbol: 'c', productions: ['ABCDE'] }
      ],

      A: [
        { symbol: 'a', productions: ['a'] },
        { symbol: '', productions: [''] }
      ],

      B: [
        { symbol: 'b', productions: ['b'] },
        { symbol: '', productions: [''] }
      ],

      C: [
        { symbol: 'c', productions: ['c'] }
      ],

      D: [
        { symbol: 'd', productions: ['d'] },
        { symbol: '', productions: [''] }
      ],

      E: [
        { symbol: 'e', productions: ['e'] },
        { symbol: '', productions: [''] }
      ]
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

    firsts: {
      E: [
        { symbol: 'i', productions: ['TZ'] },
        { symbol: '(', productions: ['TZ'] }
      ],

      Z: [
        { symbol: '+', productions: ['+TZ'] },
        { symbol: '', productions: [''] }
      ],

      T: [
        { symbol: 'i', productions: ['FY'] },
        { symbol: '(', productions: ['FY'] }
      ],

      Y: [
        { symbol: '*', productions: ['*FY'] },
        { symbol: '', productions: [''] }
      ],

      F: [
        { symbol: 'i', productions: ['i'] },
        { symbol: '(', productions: ['(E)'] }
      ]
    }
  },

  {
    grammar: new Grammar('S', {
      S: ['ACB', 'CbB', 'Ba'],
      A: ['da', 'BC'],
      B: ['g', ''],
      C: ['h', '']
    }),

    firsts: {
      S: [
        { symbol: 'd', productions: ['ACB'] },
        { symbol: 'g', productions: ['ACB', 'Ba'] },
        { symbol: 'h', productions: ['ACB', 'CbB'] },
        { symbol: '', productions: ['ACB'] },
        { symbol: 'b', productions: ['CbB'] },
        { symbol: 'a', productions: ['Ba'] }
      ],

      A: [
        { symbol: 'd', productions: ['da'] },
        { symbol: 'g', productions: ['BC'] },
        { symbol: 'h', productions: ['BC'] },
        { symbol: '', productions: ['BC'] }
      ],

      B: [
        { symbol: 'g', productions: ['g'] },
        { symbol: '', productions: [''] }
      ],

      C: [
        { symbol: 'h', productions: ['h'] },
        { symbol: '', productions: [''] }
      ]
    }
  }
]

function adjustForComparison(list) {
  list = list.map(item => _.pick(item, ['symbol', 'productions']))

  list.forEach(item => {
    item.productions = _.sortBy(item.productions)
  })

  return _.sortBy(list, ['symbol'])
}

describe('FirstSetFinder', () => {

  describe('#getFirstSet()', () => {
    _.forEach(tests, (test, i) => {
      describe('Grammar ' + (i + 1), () => {
        _.forEach(test.firsts, (firstSet, symbol) => {
          it('should calculate first set correctly for symbol ' + symbol, () => {
            var calculated = adjustForComparison(FirstSetFinder.getFirstSet(test.grammar, symbol))
            firstSet = adjustForComparison(firstSet)

            expect(firstSet).to.deep.equal(calculated)
          })
        })
      })
    })
  })

  describe('#getFirstSets()', () => {
    _.forEach(tests, (test, i) => {
      describe('Grammar ' + (i + 1), () => {
        it('should calculate first sets correctly', () => {
          var calculated = FirstSetFinder.getFirstSets(test.grammar)
          calculated = _.mapValues(calculated, c => adjustForComparison(c))

          var firstSets = _.mapValues(test.firsts, c => adjustForComparison(c))

          expect(firstSets).to.deep.equal(calculated)
        })
      })
    })
  })

})
