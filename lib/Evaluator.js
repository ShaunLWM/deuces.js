const LookupTable = require("./LookupTable");
const Card = require("./Card");
const Helper = require("./Helper");

class Evaluator {
    constructor() {
        this.table = new LookupTable();
        this.hand_size_map = {
            5: this._five,
            6: this._six,
            7: this._seven
        }
    }

    evaluate(cards, board) {
        let all_cards = cards.concat(board);
        return (this.hand_size_map[all_cards.length]).apply(this, all_cards);
    }

    _five() {
        let cards = [...arguments];
        if (cards[0] & cards[1] & cards[2] & cards[3] & cards[4] & 0xF000) {
            const handOR = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> 16;
            const prime = Card.prime_product_from_rankbits(handOR);
            return this.table.flush_lookup[prime];
        } else {
            const prime = Card.prime_product_from_hand(cards);
            return this.table.unsuited_lookup[prime];
        }
    }

    _six() {
        let cards = [...arguments];
        let minimum = LookupTable.MAX_HIGH_CARD
        let all5cardcombobs = Helper.permutate(cards, 5)
        for (let combo in all5cardcombobs) {
            let score = this._five(combo)
            if (score < minimum) minimum = score
        }

        return minimum;
    }

    _seven() {
        let cards = [...arguments];
        let minimum = LookupTable.MAX_HIGH_CARD
        let all5cardcombobs = Helper.permutate(cards, 5)
        for (let combo in all5cardcombobs) {
            let score = this._five(combo);
            if (score < minimum) minimum = score
            return minimum
        }
    }

    get_rank_class(hr) {
        if (hr >= 0 && hr <= LookupTable.MAX_STRAIGHT_FLUSH)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_STRAIGHT_FLUSH]
        else if (hr <= LookupTable.MAX_FOUR_OF_A_KIND)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_FOUR_OF_A_KIND]
        else if (hr <= LookupTable.MAX_FULL_HOUSE)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_FULL_HOUSE]
        else if (hr <= LookupTable.MAX_FLUSH)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_FLUSH]
        else if (hr <= LookupTable.MAX_STRAIGHT)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_STRAIGHT]
        else if (hr <= LookupTable.MAX_THREE_OF_A_KIND)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_THREE_OF_A_KIND]
        else if (hr <= LookupTable.MAX_TWO_PAIR)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_TWO_PAIR]
        else if (hr <= LookupTable.MAX_PAIR)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_PAIR]
        else if (hr <= LookupTable.MAX_HIGH_CARD)
            return LookupTable.MAX_TO_RANK_CLASS[LookupTable.MAX_HIGH_CARD]
        else
            return new Error("Inavlid hand rank, cannot return rank class")
    }

    class_to_string(class_int) {
        return LookupTable.RANK_CLASS_TO_STRING[class_int]
    }

    get_five_card_rank_percentage(hand_rank) {
        return float(hand_rank) / float(LookupTable.MAX_HIGH_CARD)
    }

    hand_summary(board, hands) {
        if (board.length !== 5) return "Invalid board length";
        for (const hand in hands) {
            if (hand.length !== 2) return "Invalid hand length"
        }

        const line_length = 10;
        const stages = ["FLOP", "TURN", "RIVER"]

        for (let i in Helper.range(stages.length)) {
            consol`${"=" * line_length}  ${line % stages[i]} ${"=" * line_length}`;
            let best_rank = 7463
            const winners = []
            for (let player = 0; player < hands.length; player += 1) {
                let hand = hands[player];
                let rank = this.evaluate(hand, board.slice(0, i + 3))
                let rank_class = this.get_rank_class(rank)
                let class_string = this.class_to_string(rank_class)
                let percentage = 1.0 - this.get_five_card_rank_percentage(rank)
                console.log(`Player ${player + 1} hand = ${class_string}, percentage rank among all hands = ${percentage}`);
                if (rank === best_rank) {
                    winners.append(player)
                    best_rank = rank
                } else if (rank < best_rank) {
                    winners = [player]
                    best_rank = rank
                }
            }
        }

        if (i !== stages.indexOf("RIVER")) {
            if (winners.length === 1)
                console.log(`Player ${winners[0] + 1} hand is currently winning.\n`)
            else
                console.log("something")
            // console.log "Players %s are tied for the lead.\n" % [x + 1 for x in winners]
        } else {
            console.log(`${"=".repeat(line_length)} HAND OVER ${"=" * line_length}`);
            if (winners.length === 1)
                console.log(`Player ${winners[0] + 1} is the winner with a ${this.class_to_string(this.get_rank_class(this.evaluate(hands[winners[0]], board)))}\n`)
            else
                console.log(`Players ${winners} tied for the win with a ${this.class_to_string(this.get_rank_class(this.evaluate(hands[winners[0]], board)))}\n`)
        }
    }
}

module.exports = Evaluator;
