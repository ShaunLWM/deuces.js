/*
    Number of Distinct Hand Values:
    Straight Flush   10
    Four of a Kind   156      [(13 choose 2) * (2 choose 1)]
    Full Houses      156      [(13 choose 2) * (2 choose 1)]
    Flush            1277     [(13 choose 5) - 10 straight flushes]
    Straight         10
    Three of a Kind  858      [(13 choose 3) * (3 choose 1)]
    Two Pair         858      [(13 choose 3) * (3 choose 2)]
    One Pair         2860     [(13 choose 4) * (4 choose 1)]
    High Card      + 1277     [(13 choose 5) - 10 straights]
    -------------------------
    TOTAL            7462
    Here we create a lookup table which maps:
        5 card hand's unique prime product => rank in range [1, 7462]
    Examples:
    * Royal flush (best hand possible)          => 1
    * 7-5-4-3-2 unsuited (worst hand possible)  => 7462
*/

const Card = require("./Card");

MAX_STRAIGHT_FLUSH = 10
MAX_FOUR_OF_A_KIND = 166
MAX_FULL_HOUSE = 322
MAX_FLUSH = 1599
MAX_STRAIGHT = 1609
MAX_THREE_OF_A_KIND = 2467
MAX_TWO_PAIR = 3325
MAX_PAIR = 6185
MAX_HIGH_CARD = 7462

MAX_TO_RANK_CLASS = {
    MAX_STRAIGHT_FLUSH: 1,
    MAX_FOUR_OF_A_KIND: 2,
    MAX_FULL_HOUSE: 3,
    MAX_FLUSH: 4,
    MAX_STRAIGHT: 5,
    MAX_THREE_OF_A_KIND: 6,
    MAX_TWO_PAIR: 7,
    MAX_PAIR: 8,
    MAX_HIGH_CARD: 9
}

RANK_CLASS_TO_STRING = {
    1: "Straight Flush",
    2: "Four of a Kind",
    3: "Full House",
    4: "Flush",
    5: "Straight",
    6: "Three of a Kind",
    7: "Two Pair",
    8: "Pair",
    9: "High Card"
}
class LookupTable {
    constructor() {
        this.flush_lookup = {};
        selthisf.unsuited_lookup = {};
        this.flushes();
        this.multiples();
    }

    flushes() {
        straight_flushes = [
            7936, // int('0b1111100000000', 2), # royal flush
            3968, // int('0b111110000000', 2),
            1984, // int('0b11111000000', 2),
            992, // int('0b1111100000', 2),
            496, // int('0b111110000', 2),
            248, // int('0b11111000', 2),
            124, // int('0b1111100', 2),
            62, // int('0b111110', 2),
            31, // int('0b11111', 2),
            4111 // int('0b1000000001111', 2) # 5 high
        ]

        const flushes = []
        const gen = this.get_lexographically_next_bit_sequence(parseInt('11111', 2));
        for (let i of [...Array(1277 + straight_flushes.length - 1).keys()]) {
            let f = gen.next().value;
            // console.log(f)
            let notSF = true;
            // https://stackoverflow.com/questions/51168871/xor-operator-in-javascript-to-check-against-value
            for (let sf of straight_flushes)
                if (parseInt(f, 2) ^ parseInt(sf, 2) == 0) notSF = false
            if (notSF) flushes.push(f)
        }

        flushes.reverse()
        let rank = 1
        for (sf of straight_flushes) {
            prime_product = Card.prime_product_from_rankbits(sf)
            this.flush_lookup[prime_product] = rank
            rank += 1
        }

        rank = MAX_FULL_HOUSE + 1
        for (f of flushes) {
            prime_product = Card.prime_product_from_rankbits(f)
            this.flush_lookup[prime_product] = rank
            rank += 1
        }

        this.straight_and_highcards(straight_flushes, flushes)
    }

    straight_and_highcards(straights, highcards) {
        rank = LookupTable.MAX_FLUSH + 1

        for (let s of straights) {
            prime_product = Card.prime_product_from_rankbits(s)
            this.unsuited_lookup[prime_product] = rank
            rank += 1
        }

        rank = LookupTable.MAX_PAIR + 1
        for (let h of highcards) {
            prime_product = Card.prime_product_from_rankbits(h)
            this.unsuited_lookup[prime_product] = rank
            rank += 1
        }
    }

    multiples(self) {
        // https://github.com/worldveil/deuces/blob/master/deuces/lookup.py#L148
        let backwards_ranks = range(len(Card.INT_RANKS) - 1, -1, -1)

        rank = LookupTable.MAX_STRAIGHT_FLUSH + 1

    }

    write_table_to_disk(table, filepath) {
        // with open(filepath, 'w') as f:
        //     for prime_prod, rank in table.iteritems():
        //         f.write(str(prime_prod) +","+ str(rank) + '\n')
    }

    get_lexographically_next_bit_sequence(bits) {
        let t = (bits | (bits - 1)) + 1;
        let next = t | ((((t & -t) / (bits & -bits)) >> 1) - 1);
        yield next;
        while (true) {
            t = (next | (next - 1)) + 1;
            next = t | ((((t & -t) / (next & -next)) >> 1) - 1);
            yield next;
        }
    }
}
