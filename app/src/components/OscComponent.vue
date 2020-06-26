<template>
    <div class="chart-div-container" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu" class="px-0">
            <li @click="closeHandle(chartId)">
                <a href="#"><b>закрыть</b></a>
            </li>
            <li @click="exitHandle">
                <a href="#"><b>выйти</b></a>
            </li>
        </vue-context>
        <div class="chart-div" ref="chartDiv"></div>
    </div>
</template>

<script>
    import {VueContext} from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

    import optimize from '../helpfun/optimization.js'

    export default {
        data() {
            return {
                index: 0,
                chart: null,
                valueAxis: null
            }
        },
        components: {
            VueContext
        },
        props: [
            'chartData', 'chartName',
            'chartId', 'countSteps',
            'timeValue', 'firstDate'
        ],
        watch: {
            chartData: function () {
                this.myRenderChart();
            },
            chartName: function () {
                this.myRenderChart();
            },
            chartId: function () {
                this.myRenderChart();
            },
            countSteps: function () {
                this.myRenderChart();
            },
            timeValue: function () {
                this.myRenderChart();
            },
            firstDate: function () {
                this.myRenderChart();
            },
            globalRange: function (newVal) {
                this.valueAxis.zoom(newVal, true);
            }
        },
        computed: {
            globalRange: function () {
                return this.$store.getters.GLOBAL_RANGE;
            }
        },
        mounted() {
            am4core.useTheme(am4themes_dataviz);

            this.chart = am4core.create(this.$refs.chartDiv, am4charts.XYChart);

            let len = this.myRenderChart();

            let timeAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
            timeAxis.extraMax = 0;
            timeAxis.extraMin = 0;
            timeAxis.strictMinMax = true;
            timeAxis.min = 0;
            timeAxis.max = (this.timeValue / 1000) * (len - 1);
            timeAxis.renderer.minGridDistance = 50;

            let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

            this.valueAxis = timeAxis

            let series = this.chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "y";
            series.dataFields.valueX = "x";
            series.tooltipText = "{valueY}";
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.background.fillOpacity = 0.5;

            this.chart.scrollbarX = new am4charts.XYChartScrollbar();
            timeAxis.events.on("datarangechanged", () => {
                const range = {start: timeAxis.start, end: timeAxis.end, priority: "start"};
                this.$store.commit("REFRESH_GLOBAL_RANGE", range);
            })
            this.chart.scrollbarX.series.push(series);

            this.chart.cursor = new am4charts.XYCursor();
            this.chart.cursor.xAxis = timeAxis;
            this.chart.cursor.snapToSeries = series;
        },
        methods: {
            gcd: function(a, b) {
                if (!b) {
                    return a;
                }

                return this.gcd(b, a % b);
            },
            myRenderChart: function () {
                let w = this.$refs.chartDiv.clientWidth
                if (w === 0) {
                    w = 500
                }
                let data = optimize.optimizeData(this.chartData, w)
                this.chart.data = this.generateChartData(data);
                return data.length
            },
            generateChartData: function (data) {
                let chartData = [];
                for (let i = 0; i < data.length; i++) {
                    chartData.push({
                        x: (this.timeValue / 1000) * i,
                        y: data[i]
                    });
                }
                return chartData;
            },
            closeHandle: function (key) {
                this.$store.dispatch('DELETE_ITEM_FROM_OSC', key);
            },
            exitHandle: function () {
                this.$store.dispatch('UPDATE_OSC_DIALOG', false);
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
