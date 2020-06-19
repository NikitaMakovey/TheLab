<template>
    <div class="chart-div-container" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu" class="px-0">
            <li @click="$store.commit('REMOVE_ANALYZE_ID', chartId)">
                <a href="#"><b>закрыть</b></a>
            </li>
            <li @click="$store.commit('REFRESH_ANALYZE')">
                <a href="#"><b>закрыть все</b></a>
            </li>
            <li @click="$store.commit('REFRESH_ANALYZE_DIALOG', false)">
                <a href="#"><b>выйти</b></a>
            </li>
        </vue-context>
        <div class="chart-div" ref="chartDiv"></div>
    </div>
</template>

<script>
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

    const fft = require('fft-js').dft,
        fftUtil = require('fft-js').util;

    export default {
        name: "AnalyzerComponent",
        components: {
            VueContext
        },
        // scalingMode
        // 0 - amp
        // 1 - log amp
        // 2 - psd
        // 3 - log psd

        // zeroMode
        // 0 - noting to do
        // 1 - x(0) = |x(1)|
        // 2 - x(0) = 0

        props: ["chartId", "chartData", "sampleRate", "scalingMode", "zeroMode", "smoothingLength", "begin", "end"],
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.updateData();
        },
        watch: {
            chartId: function() {
                this.updateData();
            },
            chartData: function () {
                this.updateData();
            },
            sampleRate: function () {
                this.updateData();
            },
            scalingMode: function () {
                this.updateData();
            },
            zeroMode: function () {
                this.updateData();
            },
            smoothingLength: function () {
                this.updateData();
            },
            begin: function () {
                this.updateData();
            },
            end: function () {
                this.updateData();
            }
        },
        methods: {
            smoothing: function(data, L) {
                if (L !== 0 && data.length !== 0) {
                    let wnd = [];
                    let cur = 0.0;

                    for (let i = 0; i < 2 * L + 1; i++) {
                        let tmpCur = data[(data.length * L - L + i) % data.length];
                        cur += tmpCur;
                        wnd.push(tmpCur);
                    }
                    data[0] = cur / (2 * L + 1);

                    for (let i = 1; i < data.length; i++) {
                        cur -= wnd[0];
                        wnd.splice(0, 1);

                        let tmpCur = data[(i + L) % data.length];
                        cur += tmpCur;
                        wnd.push(tmpCur);

                        data[i] = cur / (2 * L + 1);
                    }
                }

                return data;
            },
            updateData: function () {
                if (this.chart === null) {
                    am4core.useTheme(am4themes_dataviz);

                    this.chart = am4core.create(this.$refs.chartDiv, am4charts.XYChart);

                    let timeAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
                    timeAxis.extraMax = 0;
                    timeAxis.extraMin = 0;
                    timeAxis.strictMinMax = true;
                    timeAxis.renderer.minGridDistance = 50;

                    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.extraMax = 0;
                    valueAxis.extraMin = 0;
                    valueAxis.strictMinMax = true;

                    let series = this.chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = "y";
                    series.dataFields.valueX = "x";
                    series.tooltipText = "{valueY}";
                    series.tooltip.pointerOrientation = "vertical";
                    series.tooltip.background.fillOpacity = 0.5;

                    this.chart.scrollbarX = new am4charts.XYChartScrollbar();
                    this.chart.scrollbarX.series.push(series);

                    this.chart.cursor = new am4charts.XYCursor();
                    this.chart.cursor.xAxis = timeAxis;
                    this.chart.cursor.snapToSeries = series;
                }

                let begin = Math.max(0, this.begin);
                let end = Math.min(Math.max(0, this.chartData.length - 1), this.end);
                if (end < begin) end = begin;

                let chartData = [];
                for (let i = begin; i <= end; i++) {
                    chartData.push(this.chartData[i]);
                }

                let phasors = fft(chartData);

                // console.log(phasors);
                //
                // if (phasors.length >= 2) {
                //     phasors[0] = phasors[1];
                // }

                let magnitudes = fftUtil.fftMag(phasors);

                let dt = []
                const deltaTime = 1.0 / this.sampleRate;

                for (let i = 0; i < phasors.length / 2; i++) {
                    let curVal = deltaTime * magnitudes[i];
                    if (this.scalingMode === 1) {
                        curVal = 20 * Math.log10(curVal);
                    } else if (this.scalingMode === 2) {
                        curVal = curVal * curVal;
                    } else if (this.scalingMode === 3) {
                        curVal = 10 * Math.log10(curVal * curVal);
                    }

                    dt.push(curVal);
                }

                if (this.zeroMode === 1) {
                    dt[0] = Math.abs(dt[1]);
                } else if (this.zeroMode === 2) {
                    dt[0] = 0.0;
                }

                dt = this.smoothing(dt, this.smoothingLength);

                const FFTSampleRate = 2.0 / (this.sampleRate / (phasors.length / 2));
                dt = dt.map((currentValue, index) => { return { x: index * (1.0 / FFTSampleRate), y: currentValue } });

                this.chart.data = dt;
            }
        },
        beforeDestroy() {
            if (this.chart) {
                this.chart.dispose();
            }
        }
    }
</script>

<style scoped>
.chart-div-container {
    width: 100%;
    height: 350px;
}

.chart-div {
    width: 100%;
    height: 350px;
}
</style>
