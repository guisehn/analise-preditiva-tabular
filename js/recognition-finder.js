'use strict'

var Utils = require('./utils')
var _ = require('lodash')

function getRecognation(input, grammar, parsingTable) {

  var stack = ['$', grammar.startSymbol]
  input = input.split("")
  input[input.length] = '$'
  var output = [''] 
  var ret = []

  ret[ret.length] = {s:stack.join(""), i:input.join(""), o:output[output.length-1]}

  while(stack.length != 0 && input.length != 0){
  	if(stack[stack.length-1] == input[0]){
  		input.shift()
  		stack.pop()
  		output[output.length] = '';
  	}else{
  		var aux = parsingTable[stack[stack.length-1]]
  		if (!aux || !(input[0] in aux) || aux[input[0]].length === 0){
  			break;
  		}
  		aux = aux[input[0]][0].split("")
  		
  		var aux2 = stack[stack.length-1]

  		stack.pop()
  		stack = stack.concat(aux.reverse())
  		output[output.length] = aux2+' → '+Utils.emptyToEpsilon(aux.reverse().join(''));
  	}
  	if(!(stack.length == 0 && input.length == 0)){
		ret[ret.length] = {s:stack.join(""), i:input.join(""), o:output[output.length-1]}
  	}
  }

  if(stack.length == 0 && input.length == 0){
  	alert('Sentença reconhecida')
  }else{
  	alert('Sentença não reconhecida')
  }

  return ret
}

module.exports = {
  getRecognation: getRecognation
}
