import LookupTable, {
	MAX_FLUSH,
	MAX_FOUR_OF_A_KIND,
	MAX_FULL_HOUSE,
	MAX_HIGH_CARD,
	MAX_PAIR,
	MAX_STRAIGHT,
	MAX_STRAIGHT_FLUSH,
	MAX_THREE_OF_A_KIND,
	MAX_TO_RANK_CLASS,
	MAX_TWO_PAIR,
	RANK_CLASS_TO_STRING,
} from "./LookupTable";
import * as Card from "./Card";
import * as Helper from "./Helper";
import range from "fill-range";

export default class Evaluator {
	table: LookupTable;
	constructor() {
		this.table = new LookupTable();
	}

	evaluate(cards: number[], board: number[]) {
		const allCards = cards.concat(board);
		switch (allCards.length) {
			case 5:
				return this._five(allCards);
			case 6:
				return this._six(allCards);
			case 7:
				return this._seven(allCards);
			default:
				throw new Error("Unknown number length of cards");
		}
	}

	_five(cards: number[]) {
		if (cards[0] & cards[1] & cards[2] & cards[3] & cards[4] & 0xf000) {
			const handOR =
				(cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> 16;
			const prime = Card.primeProductFromRankbits(handOR);
			return this.table.flushLookup[prime];
		} else {
			const prime = Card.primeProductFromHand(cards);
			return this.table.unsuitedLookup[prime];
		}
	}

	_six(cards: number[]) {
		let minimum = MAX_HIGH_CARD;
		const all5cardcombobs = Helper.permutate(cards, 5);
		for (const combo of all5cardcombobs) {
			const score = this._five(combo);
			if (score < minimum) minimum = score;
		}

		return minimum;
	}

	_seven(cards: number[]) {
		let minimum = MAX_HIGH_CARD;
		const all5cardcombobs = Helper.permutate(cards, 5);
		for (const combo of all5cardcombobs) {
			const score = this._five(combo);
			if (score < minimum) minimum = score;
		}

		return minimum;
	}

	getRankClass(hr: number) {
		if (hr >= 0 && hr <= MAX_STRAIGHT_FLUSH)
			return MAX_TO_RANK_CLASS.MAX_STRAIGHT_FLUSH;
		else if (hr <= MAX_FOUR_OF_A_KIND)
			return MAX_TO_RANK_CLASS.MAX_FOUR_OF_A_KIND;
		else if (hr <= MAX_FULL_HOUSE) return MAX_TO_RANK_CLASS.MAX_FULL_HOUSE;
		else if (hr <= MAX_FLUSH) return MAX_TO_RANK_CLASS.MAX_FLUSH;
		else if (hr <= MAX_STRAIGHT) return MAX_TO_RANK_CLASS.MAX_STRAIGHT;
		else if (hr <= MAX_THREE_OF_A_KIND)
			return MAX_TO_RANK_CLASS.MAX_THREE_OF_A_KIND;
		else if (hr <= MAX_TWO_PAIR) return MAX_TO_RANK_CLASS.MAX_TWO_PAIR;
		else if (hr <= MAX_PAIR) return MAX_TO_RANK_CLASS.MAX_PAIR;
		else if (hr <= MAX_HIGH_CARD) return MAX_TO_RANK_CLASS.MAX_HIGH_CARD;
		else return new Error("Invalid hand rank, cannot return rank class");
	}

	classToString(classInt: number) {
		return RANK_CLASS_TO_STRING[classInt];
	}

	getFiveCardRankPercentage(handRank: number) {
		return (handRank * 1.0) / MAX_HIGH_CARD;
	}

	handSummary(board: number[], hands: number[][]) {
		if (board.length !== 5) return console.log("Invalid board length");
		for (const hand of hands) {
			// TODO: .every
			if (hand.length !== 2) return console.log("Invalid hand length");
		}

		const line_length = 10;
		const stages = ["FLOP", "TURN", "RIVER"];
		for (const i of range(0, stages.length - 1)) {
			console.log(
				`${"=".repeat(line_length)} ${stages[i]} ${"=".repeat(line_length)}`
			);
			let bestRank = 7463;
			let winners: number[] = [];
			for (let player = 0; player < hands.length; player += 1) {
				const hand = hands[player];
				const rank = this.evaluate(hand, board.slice(0, i + 3));
				const rankClass = this.getRankClass(rank);
				const classString = this.classToString(rankClass as number);
				const percentage = 1.0 - this.getFiveCardRankPercentage(rank);
				console.log(
					`Player ${player +
						1} hand = ${classString}, percentage rank among all hands = ${percentage}`
				);
				if (rank === bestRank) {
					winners.push(player);
					bestRank = rank;
				} else if (rank < bestRank) {
					winners = [player];
					bestRank = rank;
				}
			}

			if (i !== stages.indexOf("RIVER")) {
				if (winners.length === 1)
					console.log(`Player ${winners[0] + 1} hand is currently winning.\n`);
				else
					console.log(
						`Players ${winners.map((_m, i) => i + 1)} are tied for the lead.\n`
					);
			} else {
				console.log(
					`${"=".repeat(line_length)} HAND OVER ${"=".repeat(line_length)}`
				);
				if (winners.length === 1)
					console.log(
						`Player ${winners[0] + 1} is the winner with a ${this.classToString(
							this.getRankClass(
								this.evaluate(hands[winners[0]], board)
							) as number
						)}\n`
					);
				else
					console.log(
						`Players ${winners.map(
							(_m, i) => i + 1
						)} tied for the win with a ${this.classToString(
							this.getRankClass(
								this.evaluate(hands[winners[0]], board)
							) as number
						)}\n`
					);
			}
		}
	}
}

module.exports = Evaluator;
