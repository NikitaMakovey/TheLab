export default {
    functionForRandomization: function (a, b) {
        return (a + (b - a) * Math.random())
    },
    functionForNormalRandomization: function (a, q) {
        let s = 0;
        for (let i = 0; i < 12; i++) {
            s += Math.random();
        }
        return (a + Math.sqrt(q) * (s - 6))
    }
}
