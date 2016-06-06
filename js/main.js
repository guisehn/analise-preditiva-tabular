'use strict'

var Utils = require('./utils')
var GrammarVerifier = require('./grammar-verifier')
var GrammarParser = require('./grammar-parser')
var FirstSetFinder = require('./first-set-finder')
var FollowSetFinder = require('./follow-set-finder')
var ParsingTableFinder = require('./parsing-table-finder')
var SentenceRecognizer = require('./sentence-recognizer')
var $ = require('jquery')
var parsingTable
var grammar

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

$('#sentence-recognizer-form').submit(e => {
  recognize()
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
  var table = $('<table class="table table-bordered"></table>')
    .html('\
      <thead>\
        <tr>\
          <th width="10%"></th>\
          <th></th>\
        </tr>\
      </thead>\
      <tbody class="monospace"></tbody>\
    ')

  table.find('th:eq(0)').text(leftTitle)
  table.find('th:eq(1)').text(rightTitle)

  _.forEach(object, (right, left) => {
    var tr = $('<tr></tr>')

    $('<td></td>').appendTo(tr).text(left)
    $('<td></td>').appendTo(tr).text(right.join(', '))

    table.find('tbody').append(tr)
  })

  return table
}

function showParsingTable(grammar, parsingTable) {
  var table = $('<table class="table table-bordered monospace"></table>')
    .html('\
      <thead><tr><th></th></tr></thead>\
      <tbody></tbody>\
    ')

  var terminals = _.keys(parsingTable[grammar.getNonTerminals()[0]])
  var width = Math.ceil(100 / terminals.length)

  _.forEach(terminals, terminal => {
    $('<th></th>').css('width', width + '%').text(terminal).appendTo(table.find('thead tr'))
  })

  _.forEach(parsingTable, (items, leftSide) => {
    var tr = $('<tr></tr>').appendTo(table.find('tbody'))

    $('<th></th>').text(leftSide).appendTo(tr)

    _.forEach(terminals, terminal => {
      $('<td></td>').text(
        Utils.emptyToEpsilon(items[terminal]).map(p => leftSide + ' → ' + p).join(', ')
      ).appendTo(tr)
    })
  })

  $('#parsing-table').html(table)
}

function showGrammarRepresentation(grammar) {
  $('#representation').text(grammar.getRepresentation())
}

function showFirstSetTable(firstSet) {
  var table = mountTable(firstSet, 'Símbolo', 'First')
  $('#first-set-table').html(table)
}

function showFollowSetTable(followSet) {
  followSet = Utils.emptyToEpsilon(followSet)

  var table = mountTable(followSet, 'Símbolo', 'Follow')
  $('#follow-set-table').html(table)
}

function showSentenceRecognition(recognition) {
  var table = $('<table class="table table-bordered"></table>')
    .html('\
      <thead>\
        <tr>\
          <th></th>\
          <th></th>\
          <th></th>\
        </tr>\
      </thead>\
      <tbody class="monospace"></tbody>\
    ')

  table.find('th:eq(0)').text("Pilha")
  table.find('th:eq(1)').text("Entrada")
  table.find('th:eq(2)').text("Saída")

  _.forEach(recognition.table, line => {
    var tr = $('<tr></tr>')
    $('<td></td>').appendTo(tr).text(line.s)
    $('<td></td>').appendTo(tr).text(line.i)
    $('<td></td>').appendTo(tr).text(line.o)
    table.find('tbody').append(tr)
  })

  var message = $('<div role="alert" class="alert"></div>')
    .addClass(recognition.success ? 'alert-success' : 'alert-danger')
    .text(recognition.success ? 'A sentença foi reconhecida' : 'A sentença não foi reconhecida')

  $('#sentence-recognizer-table').hide().html('').append(message).append(table).fadeIn('fast')
}

function process(grammar) {
  if (!validate(grammar)) {
    return
  }

  try {
    var firstSet = FirstSetFinder.getFirstSets(grammar)
    var followSet = FollowSetFinder.getFollowSets(grammar)
    var parsingTable = ParsingTableFinder.getParsingTable(grammar)

    showGrammarRepresentation(grammar)
    showFirstSetTable(firstSet)
    showFollowSetTable(followSet)
    showParsingTable(grammar, parsingTable)

    if (ParsingTableFinder.checkMultipleEntries(parsingTable)) {
      $('#multiple-entries-error').show()
      $('#sentence-recognizer-container').hide()
    } else {
      $('#multiple-entries-error').hide()
      $('#sentence-recognizer-container').show()
    }

    window.parsingTable = parsingTable
    window.grammar = grammar

    $('#result').hide().fadeIn('fast')

    $('#sentence-recognizer-table').hide()
    $('#sentence-input').val('')
  } catch (e) {
    console.log(e)
    alert('Ocorreu um erro. Veja o console para mais detalhes.')
  }
}

function recognize() {
  var input = $('#sentence-input').val()

  try {
    var recognition = SentenceRecognizer.recognize(input, window.grammar
      , window.parsingTable)

    showSentenceRecognition(recognition)
  } catch (e) {
    console.log(e)
    alert('Ocorreu um erro. Veja o console para mais detalhes.')
  }
}
