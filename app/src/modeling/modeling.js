import random from "./random"

export default {
    functionForGeneration1: function (n, n0) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            if (i === n0) {
                channelArray.push(1);
            } else {
                channelArray.push(0);
            }
        }
        return channelArray;
    },
    functionForGeneration2: function (n, n0) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            if (i < n0) {
                channelArray.push(0);
            } else {
                channelArray.push(1);
            }
        }
        return channelArray;
    },
    functionForGeneration3: function (n, a) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            channelArray.push(Math.pow(a, i));
        }
        return channelArray;
    },
    functionForGeneration4: function (n, a, omega, fi) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            channelArray.push(a * Math.sin(i * omega + fi));
        }
        return channelArray;
    },
    functionForGeneration5: function (n, L) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            if ((i % L) < L / 2) {
                channelArray.push(1);
            } else {
                channelArray.push(-1);
            }
        }
        return channelArray;
    },
    functionForGeneration6: function (n, L) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            channelArray.push((i % L) / L);
        }
        return channelArray;
    },
    functionForGeneration7: function (fd, t, a, tau, f, fi) {
        let channelArray = [];
        for (let i = 0; i < t; i++) {
            channelArray.push(a * Math.exp(-(i * fd) / tau) * Math.cos(2 * Math.PI * f * fd * i + fi));
        }
        return channelArray;
    },
    functionForGeneration8: function (fd, t, a, f0, fn, fi) {
        let channelArray = [];
        for (let i = 0; i < t; i++) {
            channelArray.push(a * Math.cos(2 * Math.PI * f0 * fd * i) * Math.cos(2 * Math.PI * fn * fd * i + fi));
        }
        return channelArray;
    },
    functionForGeneration9: function (fd, t, a, m, f0, fn, fi) {
        let channelArray = [];
        for (let i = 0; i < t; i++) {
            channelArray.push(a * (1 + m * Math.cos(2 * Math.PI * f0 * fd * i)) * Math.cos(2 * Math.PI * fn * fd * i + fi));
        }

        return channelArray;
    },
    functionForGeneration10: function (n, a, b) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            channelArray.push(random.functionForRandomization(a, b));
        }
        return channelArray;
    },
    functionForGeneration11: function (n, a, sigma) {
        let channelArray = [];
        for (let i = 0; i < n; i++) {
            channelArray.push(random.functionForNormalRandomization(a, sigma));
        }
        return channelArray;
    },
    functionForGeneration12: function (n, p, q, sigma, aArray, bArray) {
        let channelArray = [];
        let xArray = [];
        let yArray = [];

        for (let j = 0; j < n; j++) {
            let sum1 = 0;
            let sum2 = 0;
            xArray.push(random.functionForNormalRandomization(0, sigma));

            for (let i = 0; i < q; i++) {
                if ((j - i) > 0) {
                    sum1 += bArray[i] * xArray[j - i - 1];
                }
            }

            if (j > 0) {
                for (let i = 0; i < p; i++) {
                    if (j - i > 0) {
                        sum2 += aArray[i] * yArray[j - i - 1];
                    }
                }
            }

            yArray.push(xArray[j] + sum1 - sum2);
            channelArray.push(xArray[j] + sum1 - sum2);
        }

        return channelArray;
    }
}
