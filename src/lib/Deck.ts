import { CHAR_SUIT_TO_INT_SUIT, STR_RANKS, newCard } from "./Card";
import shuffle from "knuth-shuffle-seeded";

export default class Deck {
	cards: number[];

	constructor() {
		this.cards = shuffle(this.getFullDeck());
	}

	draw(n = 1): number[] {
		if (this.cards.length < 1) throw new Error("No more cards?");
		if (n === 1) return [this.cards.shift() as number];
		const cards: number[] = [];
		for (let i = 0; i < n; i += 1) cards.push(...this.draw());
		return cards;
	}

	getFullDeck(): number[] {
		if (this.cards && this.cards.length > 0) {
			return this.cards;
		}

		this.cards = [];
		const rank_split = STR_RANKS.split("");
		for (let i = 0; i < rank_split.length; i += 1) {
			const rank = rank_split[i];
			Object.entries(CHAR_SUIT_TO_INT_SUIT).forEach(([key]) =>
				this.cards.push(newCard(`${rank}${key}`))
			);
		}

		return this.cards;
	}
}