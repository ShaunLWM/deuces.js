export const zip = <T, R>(arr1: T[], arr2: R[]) => {
	return arr1.map((k, i) => [k, arr2[i]]);
};

// @ts-ignore
export const dict = arr => {
	const obj = {};
	// @ts-ignore
	arr.map(k => (obj[k[0]] = k[1]));
	return obj;
};

export const permutate = <T>(array: T[], size: number) => {
	// @ts-ignore
	function p(t, i) {
		if (t.length === size) return result.push(t);
		if (i + 1 > array.length) return;
		p(t.concat(array[i]), i + 1);
		p(t, i + 1);
	}
	// @ts-ignore
	let result = [];
	p([], 0);
	// @ts-ignore
	return result;
};
