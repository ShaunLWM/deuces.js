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
        this.unsuited_lookup = {};
        this.flushes();
        this.multiples();
    }

    flushes() {
        straight_flushes = [
            7936, // int('0b1111100000000', 2), // royal flush
            3968, // int('0b111110000000', 2),
            1984, // int('0b11111000000', 2),
            992, // int('0b1111100000', 2),
            496, // int('0b111110000', 2),
            248, // int('0b11111000', 2),
            124, // int('0b1111100', 2),
            62, // int('0b111110', 2),
            31, // int('0b11111', 2),
            4111 // int('0b1000000001111', 2) // 5 high
        ]

        const flushes = []
        const gen = this.get_lexographically_next_bit_sequence(parseInt('11111', 2));
        for (let i of [...Array(1277 + straight_flushes.length - 1).keys()]) {
            let f = gen.next().value;
            let notSF = true;
            for (let sf of straight_flushes) {
                const result = Number(f ^ sf)
                if (result < 1) notSF = false
            }

            if (notSF) flushes.push(f)
        }

        flushes.reverse()
        let rank = 1;
        for (let sf of straight_flushes) {
            prime_product = Card.prime_product_from_rankbits(sf)
            this.flush_lookup[prime_product] = rank
            rank += 1
        }

        rank = MAX_FULL_HOUSE + 1
        for (let f of flushes) {
            prime_product = Card.prime_product_from_rankbits(f)
            this.flush_lookup[prime_product] = rank
            rank += 1
        }

        this.straight_and_highcards(straight_flushes, flushes)
    }

    straight_and_highcards(straights, highcards) {
        let rank = MAX_FLUSH + 1
        for (let s of straights) {
            prime_product = Card.prime_product_from_rankbits(s)
            this.unsuited_lookup[prime_product] = rank
            rank += 1
        }

        rank = MAX_PAIR + 1
        for (let h of highcards) {
            prime_product = Card.prime_product_from_rankbits(h)
            this.unsuited_lookup[prime_product] = rank
            rank += 1
        }
    }

    multiples() {
        let backwards_ranks = Helper.range(Card.INT_RANKS.length - 1, -1, -1)
        let rank = MAX_STRAIGHT_FLUSH + 1
        for (let i in backwards_ranks) {
            let kickers = backwards_ranks.slice(0);
            kickers.splice(i, 1);
            for (let k in kickers) {
                let product = Card.PRIMES[i] ** 4 * Card.PRIMES[k];
                this.unsuited_lookup[product] = rank;
                rank += 1;
            }
        }

        rank = MAX_FOUR_OF_A_KIND + 1;
        for (let i in backwards_ranks) {
            let pairranks = backwards_ranks.slice(0);
            pairranks.splice(i, 1);
            for (let pr in pairranks) {
                let product = Card.PRIMES[i] ** 3 * Card.PRIMES[pr] ** 2;
                this.unsuited_lookup[product] = rank;
                rank += 1;
            }
        }

        rank = MAX_STRAIGHT + 1;
        for (let r in backwards_ranks) {
            let kickers = backwards_ranks.splice(0);
            kickers.splice(r, 1);
            gen = Helper.permutate(kickers, 2);
            for (let kickers in gen) {
                [c1, c2] = kickers;
                let product = Card.PRIMES[r] ** 3 * Card.PRIMES[c1] * Card.PRIMES[c2];
                this.unsuited_lookup[product] = rank;
                rank += 1;
            }
        }

        rank = MAX_THREE_OF_A_KIND + 1;
        let tpgen = Helper.permutate(backwards_ranks, 2);
        for (let tp in tpgen) {
            [pair1, pair2] = tp;
            kickers = backwards_ranks.splice(0);
            kickers.splice(pair1, 1);
            kickers.splice(pair2, 1);
            for (let kicker in kickers) {
                let product = Card.PRIMES[pair1] ** 2 * Card.PRIMES[pair2] ** 2 * Card.PRIMES[kicker];
                this.unsuited_lookup[product] = rank;
                rank += 1;
            }
        }

        rank = MAX_TWO_PAIR + 1;
        for (let pairrank in backwards_ranks) {
            let kickers = backwards_ranks.splice(0);
            kickers.splice(pairrank, 1);
            let kgen = Helper.permutate(kickers, 3);
            for (let kickers in kgen) {
                [k1, k2, k3] = kickers;
                let product = Card.PRIMES[pairrank] ** 2 * Card.PRIMES[k1] * Card.PRIMES[k2] * Card.PRIMES[k3];
                this.unsuited_lookup[product] = rank;
                rank += 1;
            }
        }
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