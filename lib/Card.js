const Helper = require("./Helper");

STR_RANKS = "23456789TJQKA"
INT_RANKS = [...Array(13).keys()];
PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41]
CHAR_RANK_TO_INT_RANK = Helper.dict(Helper.zip((STR_RANKS).split(""), INT_RANKS))
console.log(CHAR_RANK_TO_INT_RANK)
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
        console.log(rank_char, rank_int)
        suit_int = CHAR_SUIT_TO_INT_SUIT[suit_char]
        rank_prime = PRIMES[rank_int]
        bitrank = 1 << rank_int << 16
        suit = suit_int << 12
        rank = rank_int << 8
        return { bitrank, suit, rank, rank_prime }
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
        return card_ints.reduce((acc, cur) => {
            acc *= (c & 0xFF)
        }, 1)
    },
    prime_product_from_rankbits(rankbits) {
        return INT_RANKS.reduce((acc, cur, index) => {
            if (rankbits & (1 << i)) {
                return acc *= PRIMES[index]
            }
        }, 1);
    },
    int_to_binary(card_int) {
        //         bstr = bin(card_int)[2:][:: -1] // chop off the 0b and THEN reverse string
        //         output = list("".join(["0000" + "\t"] * 7) + "0000")

        //         for (i in range(len(bstr)))
        //             output[i + int(i / 4)] = bstr[i]

        // # output the string to console
        // output.reverse()
        // return "".join(output)
    },

    int_to_pretty_str(card_int) {
        suit_int = self.get_suit_int(card_int)
        rank_int = self.get_rank_int(card_int)
        s = self.PRETTY_SUITS[suit_int]
        r = STR_RANKS[rank_int]
        return " [ " + r + " " + s + " ] "
    },

    print_pretty_card(card_int) {
        console.log(self.int_to_pretty_str(card_int))
    },
    print_pretty_cards(card_ints) {
        // output = " "
        // for i in range(len(card_ints)) {
        //     c = card_ints[i]
        //     if i != len(card_ints) - 1:
        //         output += self.int_to_pretty_str(c) + ","
        //     else:
        //     output += self.int_to_pretty_str(c) + " "

        //     print output
        // }
    },
}
