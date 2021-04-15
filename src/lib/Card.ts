import { dict } from "./Helper";
import zip from "lodash.zip";

export const STR_RANKS = "23456789TJQKA";
export const INT_RANKS = [...Array.from({ length: 13 }, (_v, i) => i)];
export const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
const CHAR_RANK_TO_INT_RANK: { [key: string]: number } = dict(
	zip(STR_RANKS.split(""), INT_RANKS)
);

export const CHAR_SUIT_TO_INT_SUIT: Record<SHDC, number> = {
	s: 1, // spades
	h: 2, // hearts
	d: 4, // diamonds
	c: 8, // clubs
};

const INT_SUIT_TO_CHAR_SUIT = "xshxdxxxc";

const PRETTY_SUITS: Record<PrettySuitKey, string> = {
	1: decodeURIComponent("\u2660"), // spades
	2: decodeURIComponent("\u2764"), // hearts
	4: decodeURIComponent("\u2666"), // diamonds
	8: decodeURIComponent("\u2663"), // clubs
};

// @ts-ignore
const PRETTY_REDS = [2, 4];

export function newCard(str: string) {
	const rank_char = str[0];
	const suit_char = str[1] as SHDC;
	const rank_int: number = CHAR_RANK_TO_INT_RANK[rank_char];
	const suit_int: number = CHAR_SUIT_TO_INT_SUIT[suit_char];
	const rank_prime = PRIMES[rank_int];
	const bitrank = (1 << rank_int) << 16;
	const suit = suit_int << 12;
	const rank = rank_int << 8;
	return bitrank | suit | rank | rank_prime;
}

export function getRankInt(cardInt: number) {
	return (cardInt >> 8) & 0xf;
}

export function intToStr(cardInt: number) {
	const rank_int = getRankInt(cardInt);
	const suit_int = getSuitInt(cardInt);
	return STR_RANKS[rank_int] + INT_SUIT_TO_CHAR_SUIT[suit_int];
}

export function getSuitInt(cardInt: number) {
	return (cardInt >> 12) & 0xf;
}
export function getBitrankInt(cardInt: number) {
	return (cardInt >> 16) & 0x1fff;
}
export function getPrime(cardInt: number) {
	return cardInt & 0x3f;
}
export function handToBinary(cardStrs: string[]) {
	return cardStrs.map(c => {
		return newCard(c);
	});
}
export function primeProductFromHand(cardInts: number[]) {
	return cardInts.reduce((acc, cur) => (acc *= cur & 0xff), 1);
}
export function primeProductFromRankbits(rankbits: number) {
	return INT_RANKS.reduce((acc, cur) => {
		if (Number(rankbits & (1 << cur)) > 0) return (acc *= PRIMES[cur]);
		return acc;
	}, 1);
}

// @ts-ignore
export function intToPrettyStr(cardInt: number, color = false) {
	const suitInt = getSuitInt(cardInt) as PrettySuitKey;
	const rankInt = getRankInt(cardInt);
	let s = PRETTY_SUITS[suitInt];
	const r = STR_RANKS[rankInt];
	// if (color && PRETTY_REDS.includes(suit_int)) s = chalk.red(s);
	return `[${r}${s}]`;
}
export function printPrettyCard(cardInt: number, color = false) {
	console.log(intToPrettyStr(cardInt, color));
}

//@ts-ignore
export function printPrettyCards(cardInts: number[], color = false) {
	return cardInts.map(c => intToPrettyStr(c)).join(", ");
}
