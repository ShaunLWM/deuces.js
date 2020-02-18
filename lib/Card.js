const Helper = require("./Helper");

STR_RANKS = "23456789TJQKA"
INT_RANKS = [...Array(13).keys()];
PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41]
CHAR_RANK_TO_INT_RANK = Helper.dict(Helper.zip((STR_RANKS).split(""), INT_RANKS))
CHAR_SUIT_TO_INT_SUIT = {
    "s": 1, // spades
    "h": 2, // hearts
    "d": 4, // diamonds
    "c": 8, // clubs
}

INT_SUIT_TO_CHAR_SUIT = "xshxdxxxc"

// for pretty printing
PRETTY_SUITS = {
    1: decodeURIComponent("\u2660"), // spades
    2: decodeURIComponent("\u2764"), // hearts
    4: decodeURIComponent("\u2666"), // diamonds
    8: decodeURIComponent("\u2663") // clubs
}

// hearts and diamonds
PRETTY_REDS = [2, 4]
const self = module.exports = {
    STR_RANKS,
    INT_RANKS,
    PRIMES,
    CHAR_RANK_TO_INT_RANK,
    CHAR_SUIT_TO_INT_SUIT,
    INT_SUIT_TO_CHAR_SUIT,
    PRETTY_SUITS,
    PRETTY_REDS,
    newCard(str) {
        rank_char = str[0]
        suit_char = str[1]
        rank_int = CHAR_RANK_TO_INT_RANK[rank_char]
        suit_int = CHAR_SUIT_TO_INT_SUIT[suit_char]
        rank_prime = PRIMES[rank_int]
        bitrank = 1 << rank_int << 16
        suit = suit_int << 12
        rank = rank_int << 8
        return bitrank | suit | rank | rank_prime
    },
    int_to_str(card_int) {
        rank_int = self.get_rank_int(card_int)
        suit_int = self.get_suit_int(card_int)
        return STR_RANKS[rank_int] + SINT_SUIT_TO_CHAR_SUIT[suit_int]
    },
    get_rank_int(card_int) {
        return (card_int >> 8) & 0xF
    },
    get_suit_int(card_int) {
        return (card_int >> 12) & 0xF
    },
    get_bitrank_int(card_int) {
        return (card_int >> 16) & 0x1FFF
    },

    get_prime(card_int) {
        return card_int & 0x3F
    },
    hand_to_binary(card_strs) {
        return card_strs.map((c) => {
            return self.newCard(c);
        })
    },
    prime_product_from_hand(card_ints) {
        return card_ints.reduce((acc, cur) => acc *= (cur & 0xFF), 1);
    },
    prime_product_from_rankbits(rankbits) {
        return INT_RANKS.reduce((acc, cur) => {
            if (Number(rankbits & (1 << cur)) > 0) return acc *= PRIMES[cur]
            return acc;
        }, 1);
    },
    int_to_binary(card_int) {
        // bstr = bin(card_int)[2:][:: -1] // chop off the 0b and THEN reverse string
        // output = list("".join(["0000" + "\t"] * 7) + "0000")

        // for (i in range(len(bstr)))
        //     output[i + int(i / 4)] = bstr[i]

        // output.reverse()
        // return "".join(output)
    },
    int_to_pretty_str(card_int) {
        const suit_int = self.get_suit_int(card_int)
        const rank_int = self.get_rank_int(card_int)
        const s = self.PRETTY_SUITS[suit_int]
        const r = STR_RANKS[rank_int]
        return " [ " + r + " " + s + " ] "
    },

    print_pretty_card(card_int) {
        console.log(self.int_to_pretty_str(card_int))
    },
    print_pretty_cards(card_ints) {
        let output = " ";
        for (let i in Helper.range(card_ints.length)) {
            let c = card_ints[i];
            if (i !== card_ints.length - 1)
                output += self.int_to_pretty_str(c) + ","
            else
                output += self.int_to_pretty_str(c) + " "
        }

        console.log(output)
    },
}
