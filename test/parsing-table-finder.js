'use strict'

var _ = require('lodash')
var expect = require('chai').expect
var Grammar = require('../js/grammar')
var ParsingTableFinder = require('../js/parsing-table-finder')

var tests = [
  {
    grammar: new Grammar('A', {
      A: ['Bb', 'b', 'c', 'd'],
      B: ['f', '']
    }),

    parsingTable: {
      'A': {
        'b': ['b', 'Bb'],
        'c': ['c'],
        'd': ['d'],
        'f': ['Bb'],
        '$': []
      },
      'B': {
        'b': [''],
        'c': [],
        'd': [],
        'f': ['f'],
        '$': []
      }
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

    parsingTable: {
      'S': {
        'a': ['ABCDE'],
        'b': ['ABCDE'],
        'c': ['ABCDE'],
        'd': [],
        'e': [],
        '$': []
      },
      'A': {
        'a': ['a'],
        'b': [''],
        'c': [''],
        'd': [],
        'e': [],
        '$': []
      },
      'B': {
        'a': [],
        'b': ['b'],
        'c': [''],
        'd': [],
        'e': [],
        '$': []
      },
      'C': {
        'a': [],
        'b': [],
        'c': ['c'],
        'd': [],
        'e': [],
        '$': []
      },
      'D': {
        'a': [],
        'b': [],
        'c': [],
        'd': ['d'],
        'e': [''],
        '$': ['']
      },
      'E': {
        'a': [],
        'b': [],
        'c': [],
        'd': [],
        'e': ['e'],
        '$': ['']
      }
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

    parsingTable: {
      'E': {
        '+': [],
        '*': [],
        'i': ['TZ'],
        '(': ['TZ'],
        ')': [],
        '$': []
      },
      'Z': {
        '+': ['+TZ'],
        '*': [],
        'i': [],
        '(': [],
        ')': [''],
        '$': ['']
      },
      'T': {
        '+': [],
        '*': [],
        'i': ['FY'],
        '(': ['FY'],
        ')': [],
        '$': []
      },
      'Y': {
        '+': [''],
        '*': ['*FY'],
        'i': [],
        '(': [],
        ')': [''],
        '$': ['']
      },
      'F': {
        '+': [],
        '*': [],
        'i': ['i'],
        '(': ['(E)'],
        ')': [],
        '$': []
      }
    }
  },

  {
    grammar: new Grammar('S', {
      S: ['ACB', 'CbB', 'Ba'],
      A: ['da', 'BC'],
      B: ['g', ''],
      C: ['h', '']
    }),

    parsingTable: {
      'S': {
        'b': ['CbB'],
        'a': ['Ba'],
        'd': ['ACB'],
        'g': ['ACB', 'Ba'],
        'h': ['ACB', 'CbB'],
        '$': ['']
      },
      'A': {
        'b': [],
        'a': [],
        'd': ['da'],
        'g': ['BC', ''],
        'h': ['BC', ''],
        '$': ['']
      },
      'B': {
        'b': [],
        'a': [''],
        'd': [],
        'g': ['g', ''],
        'h': [''],
        '$': ['']
      },
      'C': {
        'b': [''],
        'a': [],
        'd': [],
        'g': [''],
        'h': [ 'h', ''],
        '$': ['']
      }
    }
  }
]

function adjustForComparison(parsingTable) {
  parsingTable = _.cloneDeep(parsingTable)

  _.forEach(parsingTable, (terminals, nonTerminal) => {
    _.forEach(terminals, (productions, terminal) => {
      productions.sort()
    })
  })

  return parsingTable
}

describe('ParsingTableFinder', () => {
  describe('#getParsingTable()', () => {
    _.forEach(tests, (test, i) => {
      describe('Grammar ' + (i + 1), () => {
        it('should calculate parsing table correctly', () => {
          var calculated = adjustForComparison(ParsingTableFinder.getParsingTable(test.grammar))
          var parsingTable = adjustForComparison(test.parsingTable)

          expect(calculated).to.deep.equal(parsingTable)
        })
      })
    })
  })
})
