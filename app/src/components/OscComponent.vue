<template>
    <div class="chartdiv-container" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu" class="px-0">
            <li @click="closeHandle(chartId)">
                <a href="#"><b>закрыть</b></a>
            </li>
            <li @click="exitHandle">
                <a href="#"><b>выйти</b></a>
            </li>
        </vue-context>
        <span>{{ chartName }}</span>
        <div class="chartdiv" :id="'chartdiv'+chartId"></div>
    </div>
</template>

<script>
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";

    export default {
        data() {
            return {
                index: 0
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
        mounted () {
            am4core.useTheme(am4themes_dataviz);
            am4core.useTheme(am4themes_animated);
            // this.chartName
            // this.chartData
            let chartDiv = 'chartdiv' + this.chartId;
            let chart = am4core.create(chartDiv, am4charts.XYChart);

            chart.data = this.$store.getters.OSC_CHANNELS[this.chartId];

            let timeAxis = chart.xAxes.push(new am4charts.ValueAxis());
            timeAxis.renderer.minGridDistance = 50;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "y";
            series.dataFields.valueX = "x";
            series.strokeWidth = 2;
            series.minBulletDistance = 1;
            series.tooltipText = "{valueY}";
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.background.cornerRadius = 20;
            series.tooltip.background.fillOpacity = 0.5;
            series.tooltip.label.padding(12,12,12,12);

            chart.scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX.series.push(series);

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = timeAxis;
            chart.cursor.snapToSeries = series;
            // TODO: smth
        },
        methods: {
            closeHandle: function(key) {
                this.$store.dispatch('DELETE_ITEM_FROM_OSC', key);
            },
            exitHandle: function() {
                this.$store.dispatch('UPDATE_OSC_DIALOG', false);
            }
        },

    }

</script>

<style scoped>

.chartdiv-container {
    width: 100%;
    height: 350px;
}

.chartdiv {
    width: 100%;
    height: 350px;
}

</style>
