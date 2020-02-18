const Card = require("../lib/Card");
const Deck = require("../lib/Deck");
const Evaluator = require("../lib/Evaluator");
const LookupTable = require("../lib/LookupTable");
let evaluator = new Evaluator()
let card = Card.newCard("Qh");

let board = [
    Card.newCard('2h'),
    Card.newCard('2s'),
    Card.newCard('Jc')
]
let hand = [
    Card.newCard('Qs'),
    Card.newCard('Th')
]

Card.print_pretty_cards(board.concat(hand))

rank = evaluator.evaluate(board, hand)
console.log(rank)
