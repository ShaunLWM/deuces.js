const Card = require("../lib/Card");
const Deck = require("../lib/Deck");
const Evaluator = require("../lib/Evaluator");
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
console.log(`Rank for your hand is: ${rank}`);

const deck = new Deck();
board = deck.draw(5)
player1_hand = deck.draw(2)
player2_hand = deck.draw(2)

console.log(`The board`);
Card.print_pretty_cards(board)

console.log("Player 1's cards:");
Card.print_pretty_cards(player1_hand)

console.log("Player 2's cards:");
Card.print_pretty_cards(player2_hand)

p1_score = evaluator.evaluate(player1_hand, board)
p2_score = evaluator.evaluate(player2_hand, board)

p1_class = evaluator.get_rank_class(p1_score)
p2_class = evaluator.get_rank_class(p2_score)

console.log(`Player 1 hand rank = ${p1_score} (${evaluator.class_to_string(p1_class)})`)
console.log(`Player 2 hand rank = ${p2_score} (${evaluator.class_to_string(p2_class)})`)

const hands = [player1_hand, player2_hand]
evaluator.hand_summary(board, hands)
