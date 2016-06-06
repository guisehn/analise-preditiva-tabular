'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function recognize(input, grammar, parsingTable) {
  input = input.split('').concat('$')

  var stack = ['$', grammar.startSymbol]
  var output = ''
  var table = []

  table.push({ s: stack.join(''), i: input.join(''), o: output })

  while (stack.length && input.length) {
    var last = _.last(stack)

  	if (last === input[0]) {
  		input.shift()
  		stack.pop()
  		output = ''
  	} else {
  		var aux = parsingTable[last]

  		if (!aux || !(input[0] in aux) || aux[input[0]].length === 0){
  			break
  		}

  		aux = aux[input[0]][0].split('')

  		stack.pop()
  		stack = stack.concat(_.clone(aux).reverse())

  		output = last + ' → ' + Utils.emptyToEpsilon(aux.join(''))
  	}

  	if (!(stack.length === 0 && input.length === 0)) {
		  table.push({ s: stack.join(''), i: input.join(''), o: output })
  	}
  }

  return {
    success: stack.length === 0 && input.length === 0,
    table: table
  }
}

module.exports = {
  recognize: recognize
}
