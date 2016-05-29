'use strict'

var expect = require('chai').expect
var Grammar = require('../js/grammar')
var GrammarVerifier = require('../js/grammar-verifier')

describe('GrammarVerifier', () => {
  describe('#isLeftFactored()', () => {
    it('should return false if grammar is not left-factored', () => {
      var grammar = new Grammar('S', {
        S: ['n+n', 'n*n']
      })

      expect(GrammarVerifier.isLeftFactored(grammar)).to.be.false
    })

    it('should return true if grammar is left-factored', () => {
      var grammar = new Grammar('S', {
        S: ['A', 'B'],
        A: ['n+n'],
        B: ['n*n']
      })

      expect(GrammarVerifier.isLeftFactored(grammar)).to.be.true
    })
  })

  describe('#isLeftRecursive()', () => {
    it('should return true if grammar is left-recursive', () => {
      var grammar = new Grammar('E', {
        E: ['(L)', 'a'],
        L: ['L,E', 'E']
      })

      expect(GrammarVerifier.isLeftRecursive(grammar)).to.be.true
    })

    it('should return false if grammar is not left-recursive', () => {
      var grammar = new Grammar('X', {
        E: ['F'],
        F: ['(L)', 'a'],
        L: ['FM'],
        M: [',FM', '']
      })

      expect(GrammarVerifier.isLeftRecursive(grammar)).to.be.false
    })
  })
})
