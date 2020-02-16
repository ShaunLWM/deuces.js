module.exports = {
    zip(arr1, arr2) {
        return arr1.map((k, i) => [k, arr2[i]]);
    },
    dict(arr) {
        const obj = {};
        arr.map((k, i) => obj[k[0]] = k[1])
        return obj
    }
}
