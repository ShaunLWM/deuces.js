import "jest-extended";
import Evaluator from "../src/lib/Evaluator";
import * as Card from "../src/lib/Card";
import Deck from "../src/lib/Deck";

let evaluator = new Evaluator();

describe("Full poker evaluation test", () => {
	it("should generate new deck of cards", () => {
		// let card = Card.newCard("Qh");

		let board = [Card.newCard("2h"), Card.newCard("2s"), Card.newCard("Jc")];
		let hand = [Card.newCard("Qs"), Card.newCard("Th")];
		const output = Card.printPrettyCards(board.concat(hand));
		expect(output).toBe("[2❤], [2♠], [J♣], [Q♠], [T❤]");
		const rank = evaluator.evaluate(board, hand);
		expect(rank).toBe(6066);
	});

	it("should properly play out a game", () => {
		const deck = new Deck();
		const board = deck.draw(5);
		const player1Hand = deck.draw(2);
		const player2Hand = deck.draw(2);
		expect(board.length).toBe(5);
		expect(player1Hand.length).toBe(2);
		expect(player2Hand.length).toBe(2);

		const p1Score = evaluator.evaluate(player1Hand, board);
		const p2Score = evaluator.evaluate(player2Hand, board);
		expect(p1Score).toBeNumber();
		expect(p1Score).toBeGreaterThan(0);
		expect(p2Score).toBeNumber();
		expect(p2Score).toBeGreaterThan(0);

		const p1Class = evaluator.getRankClass(p1Score);
		const p2Class = evaluator.getRankClass(p2Score);
		expect(p1Class).toBeNumber();
		expect(p1Class).toBeGreaterThan(0);
		expect(p2Class).toBeNumber();
		expect(p2Class).toBeGreaterThan(0);

		const p1HandRank = evaluator.classToString(p1Class as number);
		const p2HandRank = evaluator.classToString(p2Class as number);
		expect(p1HandRank).toBeDefined();
		expect(p2HandRank).toBeDefined();

		const hands = [player1Hand, player2Hand];
		evaluator.handSummary(board, hands);
	});
});
