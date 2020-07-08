<template>
    <img v-bind:src="imgSpectrogramSrc" style="margin-left: 16px; margin-right: 16px; max-width: 1024px; max-height: 512px">
</template>

<script>
const Jimp = require('jimp');
const ft = require('fourier-transform/asm');

export default {
    name: "SpectrogramComponent",
    props: ["chartData", "sampleRate", "coef", "brightness", "width", "height"],
    data: function () {
        return {
            imgSpectrogramSrc: "",
            begin: 0,
            end: 0
        }
    },
    mounted() {
        this.begin = Math.floor(this.$store.getters.GLOBAL_RANGE.start * (this.chartData.length - 1));
        this.end = Math.floor(this.$store.getters.GLOBAL_RANGE.end * (this.chartData.length - 1));

        this.recalcMtx()
    },
    watch: {
        chartData: function () {
            this.recalcMtx()
        },
        sampleRate: function () {
            this.recalcMtx()
        },
        coef: function () {
            this.recalcMtx()
        },
        brightness: function () {
            this.recalcMtx()
        },
        globalRange: function (newVal) {
            this.begin = Math.floor(newVal.start * (this.chartData.length - 1));
            this.end = Math.floor(newVal.end * (this.chartData.length - 1));
            this.recalcMtx()
        },
        width: function () {
            this.recalcMtx()
        },
        height: function () {
            this.recalcMtx()
        }
    },
    computed: {
        globalRange: function () {
            return this.$store.getters.GLOBAL_RANGE;
        }
    },
    methods: {
        recalcMtx: function () {
            const width = this.width;
            const height = this.height;
            const coeffN = Math.min(10.0, Math.max(1.0, this.coef));

            let left = Math.max(0, this.begin);
            let right = Math.min(Math.max(0, this.chartData.length - 1), this.end);
            if (right < left) right = left;

            const len = right - left + 1;

            console.log(len)

            // step 1
            const sectionsCount = width;
            const samplesPerSection = height;

            const spectrogramMatrix = new Array(height);
            for (let i = 0; i < height; i++) {
                spectrogramMatrix[i] = new Array(width);
                for (let j = 0; j < width; j++) {
                    spectrogramMatrix[i][j] = 0.0;
                }
            }

            // step 2
            const sectionBase = len / sectionsCount;

            // step 3
            const sectionN = Math.floor(sectionBase * coeffN);

            // step 4
            const N = 2 * samplesPerSection;

            let NN = N;
            if (sectionN > N) {
                const mult = Math.floor((sectionN + N - 1) / N);
                NN = mult * N;
            }
            const l = Math.floor(NN / N);

            for (let i = 0; i < sectionsCount; i++) {
                const x = new Array(NN);
                for (let qwe = 0; qwe < NN; qwe++) {
                    x[qwe] = 0.0
                }

                // step 5.1
                let start = Math.floor(i * sectionBase);

                // step 5.3
                let avrg = 0.0;
                for (let j = 0; j < sectionN; j++) {
                    if (j + start >= len) {
                        x[j] = 0;
                    } else {
                        x[j] = this.chartData[left + j + start];
                    }

                    avrg += x[j];
                }

                avrg /= sectionN;

                for (let j = 0; j < sectionN; j++) {
                    x[j] -= avrg;
                }

                // step 5.4
                for (let j = 0; j < sectionN; j++) {
                    let w = 0.54 - 0.46 * Math.cos(2 * Math.PI * j / Math.max(1, sectionN - 1));
                    x[j] *= w;
                }

                // step 5.5
                for (let j = sectionN; j < NN; j++) {
                    x[j] = 0;
                }

                // step 5.6
                let eeboi = 1
                while (eeboi < x.length) eeboi *= 2;
                let newX = new Array(eeboi)
                for (let qwe = 0; qwe < newX.length; qwe++) {
                    newX[qwe] = 0.0;
                }
                for (let qwe = 0; qwe < x.length; qwe++) {
                    newX[qwe] = x[qwe];
                }

                let magnitudes = ft(newX)
                let amps = [];
                const deltaTime = 1.0 / this.sampleRate;
                for (let i = 0; i < magnitudes.length; i++) {
                    let curVal = deltaTime * magnitudes[i];
                    amps.push(curVal);
                }

                let L1 = -Math.floor((l - 1) / 2), L2 = Math.floor(l / 2);
                for (let k = 0; k < samplesPerSection; k++) {
                    let sumAvg = 0.0;
                    for (let j = L1; j <= L2; j++) {
                        sumAvg += amps[Math.abs(l * k + j) % amps.length];
                    }
                    amps[k] = sumAvg / l;
                }

                // step 5.7
                for (let j = 0; j < samplesPerSection; j++) {
                    spectrogramMatrix[j][i] = amps[j];
                }
            }

            let maxVal = Number.MIN_SAFE_INTEGER;

            for (let i = 0; i < sectionsCount; i++) {
                for (let j = 0; j < samplesPerSection; j++) {
                    maxVal = Math.max(maxVal, spectrogramMatrix[j][i]);
                }
            }

            new Jimp(width, height, 0x000000ff, (err, image) => {
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {

                        const greyScale = Math.min(255, Math.floor(255 * spectrogramMatrix[y][x] * this.brightness / maxVal));

                        if (isNaN(greyScale)) {
                            continue
                        }

                        image.setPixelColor(Jimp.rgbaToInt(greyScale, greyScale, greyScale, 255), x, height - 1 - y);
                    }
                }

                image.getBase64Async(Jimp.MIME_PNG).then((base64Str) => this.imgSpectrogramSrc = base64Str);
            });
        }
    }
}
</script>

<style scoped>

</style>