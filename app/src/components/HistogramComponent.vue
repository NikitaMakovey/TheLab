<template>
    <div ref="statChartDiv"></div>
</template>

<script>
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";

    export default {
        name: "HistogramComponent",
        components: {
            VueContext
        },
        props: ["chartData"],
        mounted() {
            this.updateStatChart();
        },
        watch: {
            chartData: function () {
                this.updateStatChart();
            }
        },
        data() {
          return {
              chart: null,
              valueAxis: null
          }
        },
        methods: {
            updateStatChart: function() {
                if (this.chart === null) {
                    am4core.useTheme(am4themes_dataviz);

                    let chart = am4core.create(this.$refs.statChartDiv, am4charts.XYChart);

                    chart.colors.step = 2;

                    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = "x";
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.line.strokeOpacity = 1;
                    categoryAxis.renderer.minGridDistance = 30;
                    categoryAxis.renderer.labels.template.adapter.add("text", function () {
                        return "";
                    });

                    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.renderer.labels.template.adapter.add("text", function () {
                        return "";
                    });

                    valueAxis.extraMax = 0;
                    valueAxis.extraMin = 0;
                    valueAxis.strictMinMax = true;

                    this.valueAxis = valueAxis;

                    let series1 = chart.series.push(new am4charts.ColumnSeries());
                    series1.columns.template.width = am4core.percent(100);
                    series1.dataFields.categoryX = "x";
                    series1.dataFields.valueY = "y";

                    this.chart = chart;
                }

                const K = 100;

                let cnt = new Array(K);
                for (let i = 0; i < cnt.length; i++) cnt[i] = 0;
                const minFact = Math.min(...this.chartData)
                const maxFact = Math.max(...this.chartData)
                for (let i = 0; i < this.chartData.length; i++) {
                    let normalizedVal = (this.chartData[i] - minFact) / (maxFact - minFact);
                    cnt[Math.floor(normalizedVal * (K - 1))]++;
                }

                let maxValue = 0.0;
                let finalData = []
                for (let i = 0; i < cnt.length; i++) {
                    let nowValue = cnt[i] / this.chartData.length;
                    maxValue = Math.max(maxValue, nowValue);
                    finalData.push({ x: i, y: nowValue });
                }

                this.valueAxis.max = maxValue;

                this.chart.data = finalData;
            }
        }
    }
</script>

<style scoped>

</style>