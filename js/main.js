'use strict'

var GrammarVerifier = require('./grammar-verifier')
var FirstFollowGenerator = require('./first-follow-generator')

var g = {
  S: ["ABCDE"],
  A: ["a", ""],
  B: ["b", ""],
  C: ["c"],
  D: ["d", ""],
  E: ["e", ""]
}

console.log(FirstFollowGenerator.getFirsts(g))