'use strict'

var expect = require('chai').expect
var Grammar = require('../js/grammar')

describe('Grammar', () => {
  describe('#getNonTerminals()', () => {
    it('should return non-terminal symbols correctly', () => {
      var grammar = new Grammar('S', {
        S: ['A', 'a'],
        A: ['b']
      })

      expect(grammar.getNonTerminals().sort()).to.deep.equal(['S', 'A'].sort())
    })
  })

  describe('#getTerminals()', () => {
    it('should return terminal symbols correctly', () => {
      var grammar = new Grammar('S', {
        S: ['A', 'a'],
        A: ['b']
      })

      expect(grammar.getTerminals().sort()).to.deep.equal(['a', 'b'].sort())
    })
  })

  describe('#getRepresentation()', () => {
    it('should return representation correctly', () => {
      var grammar = new Grammar('S', {
        S: ['A', 'a'],
        A: ['b', '']
      })

      var representation = 'G = ({S, A}, {a, b}, P, S)\n'
      representation += 'P = {\n'
      representation += '  S → A | a\n'
      representation += '  A → b | ε\n'
      representation += '}'

      expect(grammar.getRepresentation()).to.equal(representation)
    })
  })
})
