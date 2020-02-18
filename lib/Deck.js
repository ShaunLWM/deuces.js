const Card = require("./Card");
const shuffle = require("knuth-shuffle-seeded");

class Deck {
    constructor() {
        this._FULL_DECK = [];
        this.cards = shuffle(this.getFullDeck());
    }

    draw(n = 1) {
        if (n === 1) return this.cards.shift();
        const cards = [];
        for (let i = 0; i < n; i += 1) cards.push(this.draw());
        return cards;
    }

    getFullDeck() {
        if (typeof this.cards !== "undefined" && this.cards.length > 0) return this.cards;
        this.cards = [];
        const rank_split = Card.STR_RANKS.split("");
        for (let i = 0; i < rank_split.length; i += 1) {
            const rank = rank_split[i];
            Object.entries(Card.CHAR_SUIT_TO_INT_SUIT).forEach(([key, val]) => {
                this.cards.push(Card.newCard(`${rank}${key}`))
            });
        }

        return this.cards;
    }
}

module.exports = Deck;
