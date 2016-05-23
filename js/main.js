'use strict'

var Utils = require('./utils')
var GrammarVerifier = require('./grammar-verifier')
var GrammarParser = require('./grammar-parser')
var FirstSetFinder = require('./first-set-finder')
var FollowSetFinder = require('./follow-set-finder')
var PredictiveSetFinder = require('./predictive-set-finder')
var $ = require('jquery')

$('#use-example').click(e => {
  $('#grammar-input').val($('#example').text().trim())
  $('#grammar-form').submit()
  e.preventDefault()
})

$('#grammar-form').submit(e => {
  var grammar, error
  var grammarInput = $('#grammar-input').val().replace(/ε/g, '')

  $('#grammar-input').val(grammarInput)

  reset()

  if (grammarInput.trim() === '') {
    showError('Prencha a gramática')
    e.preventDefault()
    return
  }

  try {
    grammar = GrammarParser.parse(grammarInput)
  } catch (e) {
    error = e.message
  }

  if (error) {
    showError(error)
  } else {
    process(grammar)
  }

  e.preventDefault()
})

function reset() {
  $('#error-message, #result').hide()
}

function showError(message) {
  $('#error-message').hide().html(message).fadeIn('fast')
}

function validate(grammar) {
  if (!GrammarVerifier.isLeftFactored(grammar)) {
    showError('Gramática deve ser fatorada à esquerda')
    return false
  }

  if (GrammarVerifier.isLeftRecursive(grammar)) {
    showError('Gramática não pode possuir recursão à esquerda')
    return false
  }

  return true
}

function mountTable(object, leftTitle, rightTitle) {
  var aux = '<th></th>'
  if(rightTitle instanceof Array){
    for (var i = 0; i < rightTitle.length-1; i++) {
      aux += '<th></th>'
    }
  }
  var table = $('<table class="table table-bordered"></table>')
    .html('\
      <thead>\
        <tr>\
          <th width="10%"></th>'+
          aux+
        '</tr>\
      </thead>\
      <tbody class="monospace"></tbody>\
    ')

  table.find('th:eq(0)').text(leftTitle)
  if(rightTitle instanceof Array){
    for (var i = 1; i <= rightTitle.length; i++) {
      table.find('th:eq('+i+')').text(rightTitle[i-1])
    }
  }else{
    table.find('th:eq(1)').text(rightTitle)
  }
  _.forEach(object, (right, left) => {
    var tr = $('<tr></tr>')

    $('<td></td>').appendTo(tr).text(left)
    $('<td></td>').appendTo(tr).text(right.join(', '))

    table.find('tbody').append(tr)
  })

  return table
}

function showGrammarRepresentation(grammar) {
  $('#representation').text(grammar.getRepresentation())
}

function showObject(grammar) {
  $('#object').html($('<pre></pre>').text(JSON.stringify(grammar, null, 2)))
}

function showFirstSetTable(grammar) {
  var firstSet = FirstSetFinder.getFirstSets(grammar)
  firstSet = Utils.emptyToEpsilon(firstSet)

  var table = mountTable(firstSet, 'Símbolo', 'First')
  $('#first-set-table').html(table)
}

function showFollowSetTable(grammar) {
  var followSet = FollowSetFinder.getFollowSets(grammar)

  followSet = Utils.emptyToEpsilon(followSet)

  var table = mountTable(followSet, 'Símbolo', 'Follow')
  $('#follow-set-table').html(table)
}

function showPredictiveSetTable(grammar){
  var predictiveSet = PredictiveSetFinder.getPredictiveSets(grammar)

  predictiveSet = Utils.emptyToEpsilon(predictiveSet)

  var table = mountTable(predictiveSet, '', grammar.getTerminals())
  $('#predictive-set-table').html(table)
}

function process(grammar) {
  if (!validate(grammar)) {
    return
  }

  try {
    showGrammarRepresentation(grammar)
    showFirstSetTable(grammar)
    showFollowSetTable(grammar)
    showPredictiveSetTable(grammar)
    showObject(grammar)

    $('#result').hide().fadeIn('fast')
  } catch (e) {
    console.log(e)
    alert('Ocorreu um erro. Veja o console para mais detalhes.')
  }
}
