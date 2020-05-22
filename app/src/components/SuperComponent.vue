<template>
    <div>
        <div class="chartdiv-container">
            <div class="chartdiv" :id="'chartdiv'+chartId"></div>
        </div>
        <div id="superCustomFile" style="padding: 1rem">

        </div>
    </div>
</template>

<script>
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    const fs = require('fs');

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

            const vm = this;
            chart.data = vm.generateChartData(this.chartData);

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
            createFile: function(data) {
                let resultString = '';
                resultString += "# channels number\n";
                resultString += "1\n";
                resultString += "# samples number\n";
                resultString += "" + (this.countSteps + 1).toString() + "\n";
                resultString += "# sampling rate\n";
                resultString += "1\n";
                resultString += "# start date\n";
                resultString += this.$moment(this.startDate).format('DD-MM-YYYY') + "\n";
                resultString += "# start time\n";
                resultString += this.$moment(this.startDate).format('HH:mm:ss.sss') + "\n";
                resultString += "# channels names\n";
                resultString += this.chartName + "\n";
                for (let i = 0; i <= this.countSteps; i++) {
                    resultString += (this.chartData[i]).toString() + "\n";
                }
                let blob = new Blob([resultString], {type: 'text/txt'});
                let url  = window.URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.download = 'output.txt';
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            generateChartData: function(data) {
                let chartData = [];
                for (let i = 0; i <= this.countSteps; i++) {
                    //console.log(chartData);
                    chartData.push({
                        x: (this.timeValue / 1000) * i,
                        y: data[i]
                    });
                }
                this.createFile(this.chartData);
                return chartData;
            },
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
