module.exports = {
    zip(arr1, arr2) {
        return arr1.map((k, i) => [k, arr2[i]]);
    },
    dict(arr) {
        const obj = {};
        arr.map((k, i) => obj[k[0]] = k[1])
        return obj
    },
    range(start, stop, step) {
        if (typeof stop == 'undefined') {
            stop = start;
            start = 0;
        }

        if (typeof step == 'undefined') step = 1;
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];
        let result = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step)result.push(i);
        return result;
    },
    permutate(array, size) {
        function p(t, i) {
            if (t.length === size) return result.push(t);
            if (i + 1 > array.length) return;
            p(t.concat(array[i]), i + 1);
            p(t, i + 1);
        }

        let result = [];
        p([], 0);
        return result;
    }
}
