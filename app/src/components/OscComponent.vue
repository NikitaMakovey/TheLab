<template>
    <div class="chartdiv" :id="'chartdiv'+chartId"></div>
</template>

<script>
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

            const vm = this;
            chart.data = vm.generateChartData(this.$store.getters.OSC_CHANNELS[this.chartId]);

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "y";
            series.dataFields.dateX = "x";
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
            chart.cursor.xAxis = dateAxis;
            chart.cursor.snapToSeries = series;
        },
        methods: {
            generateChartData: function(data) {
                let chartData = [];
                for (let i = 0; i < this.countSteps; i++) {
                    chartData.push({
                        x: this.timeValue * i,
                        y: data[i]
                    });
                }
                return chartData;
            }
        },

    }

</script>

<style scoped>
.chartdiv {
    width: 100%;
    height: 350px;
}
</style>
