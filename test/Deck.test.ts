import Deck from "../src/lib/Deck";
import "jest-extended";

describe("Deck is able to generate new deck of cards ", () => {
	it("should generate new deck of cards", () => {
		const deck = new Deck();
		const cards = deck.getFullDeck();
		expect(cards).toBeArray();
		expect(cards.length).toBe(52);
	});
});
