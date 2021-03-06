const LookupTable = require("./LookupTable");
const Card = require("./Card");
const Helper = require("./Helper");

class Evaluator {
    constructor() {
        this.table = new LookupTable.LookupTable();
    }

    evaluate(cards, board) {
        const all_cards = cards.concat(board);
        switch (all_cards.length) {
            case 5:
                return this._five(all_cards);
            case 6:
                return this._six(all_cards);
            case 7:
                return this._seven(all_cards);
        }
    }

    _five(cards) {
        if (cards[0] & cards[1] & cards[2] & cards[3] & cards[4] & 0xF000) {
            const handOR = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> 16;
            const prime = Card.prime_product_from_rankbits(handOR);
            return this.table.flush_lookup[prime];
        } else {
            const prime = Card.prime_product_from_hand(cards);
            return this.table.unsuited_lookup[prime];
        }
    }

    _six(cards) {
        let minimum = LookupTable.MAX_HIGH_CARD;
        const all5cardcombobs = Helper.permutate(cards, 5);
        for (const combo of all5cardcombobs) {
            const score = this._five(combo);
            if (score < minimum) minimum = score;
        }

        return minimum;
    }

    _seven(cards) {
        let minimum = LookupTable.MAX_HIGH_CARD;
        const all5cardcombobs = Helper.permutate(cards, 5);
        for (const combo of all5cardcombobs) {
            const score = this._five(combo);
            if (score < minimum) minimum = score;
        }

        return minimum;
    }

    get_rank_class(hr) {
        if (hr >= 0 && hr <= LookupTable.MAX_STRAIGHT_FLUSH)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_STRAIGHT_FLUSH;
        else if (hr <= LookupTable.MAX_FOUR_OF_A_KIND)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_FOUR_OF_A_KIND;
        else if (hr <= LookupTable.MAX_FULL_HOUSE)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_FULL_HOUSE;
        else if (hr <= LookupTable.MAX_FLUSH)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_FLUSH;
        else if (hr <= LookupTable.MAX_STRAIGHT)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_STRAIGHT;
        else if (hr <= LookupTable.MAX_THREE_OF_A_KIND)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_THREE_OF_A_KIND;
        else if (hr <= LookupTable.MAX_TWO_PAIR)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_TWO_PAIR;
        else if (hr <= LookupTable.MAX_PAIR)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_PAIR;
        else if (hr <= LookupTable.MAX_HIGH_CARD)
            return LookupTable.MAX_TO_RANK_CLASS.MAX_HIGH_CARD;
        else
            return new Error("Invalid hand rank, cannot return rank class");
    }

    class_to_string(class_int) {
        return LookupTable.RANK_CLASS_TO_STRING[class_int];
    }

    get_five_card_rank_percentage(hand_rank) {
        return parseFloat(hand_rank) / parseFloat(LookupTable.MAX_HIGH_CARD);
    }

    hand_summary(board, hands) {
        if (board.length !== 5) return console.log("Invalid board length");
        for (const hand of hands) {
            if (hand.length !== 2) return console.log("Invalid hand length");
        }

        const line_length = 10;
        const stages = ["FLOP", "TURN", "RIVER"];
        for (const i of Helper.range(stages.length)) {
            console.log(`${"=".repeat(line_length)} ${stages[i]} ${"=".repeat(line_length)}`);
            let best_rank = 7463;
            let winners = [];
            for (let player = 0; player < hands.length; player += 1) {
                const hand = hands[player];
                const rank = this.evaluate(hand, board.slice(0, i + 3))
                const rank_class = this.get_rank_class(rank);
                const class_string = this.class_to_string(rank_class);
                const percentage = 1.0 - this.get_five_card_rank_percentage(rank);
                console.log(`Player ${player + 1} hand = ${class_string}, percentage rank among all hands = ${percentage}`);
                if (rank === best_rank) {
                    winners.push(player);
                    best_rank = rank;
                } else if (rank < best_rank) {
                    winners = [player];
                    best_rank = rank;
                }
            }

            if (i !== stages.indexOf("RIVER")) {
                if (winners.length === 1)
                    console.log(`Player ${winners[0] + 1} hand is currently winning.\n`);
                else
                    console.log(`Players ${winners.map((m, i) => i + 1)} are tied for the lead.\n`);
            } else {
                console.log(`${"=".repeat(line_length)} HAND OVER ${"=".repeat(line_length)}`);
                if (winners.length === 1)
                    console.log(`Player ${winners[0] + 1} is the winner with a ${this.class_to_string(this.get_rank_class(this.evaluate(hands[winners[0]], board)))}\n`);
                else
                    console.log(`Players ${winners.map((m, i) => i + 1)} tied for the win with a ${this.class_to_string(this.get_rank_class(this.evaluate(hands[winners[0]], board)))}\n`);
            }
        }
    }
}

module.exports = Evaluator;
