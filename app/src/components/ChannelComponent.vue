<template>
    <div @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu" class="px-0">
            <li @click="eventHandle(chartId)">
                <a href="#"><b>осциллограмма</b></a>
            </li>
            <li @click="eventHandleStat(chartId)">
                <a href="#"><b>какашка</b></a>
            </li>
        </vue-context>
        <canvas
            height="100" width="200"
            style="border: 1px solid black; padding: 1px;"
            ref="canvas"
        ></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs'
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';

    export default {
        data() {
            return {
                //
            }
        },
        components: {
            VueContext
        },
        extends: Line,
        props: ['chartData', 'chartName', 'chartId'],
        mixins: [mixins.reactiveProp],
        mounted() {
            this.myRenderChart();
        },
        watch: {
            chartData: function () {
                this.myRenderChart();
            },
            chartName: function () {
                this.myRenderChart();
            },
            chartId: function () {
                this.myRenderChart();
            }
        },
        methods: {
            eventHandle: function (key) {
                let ids = this.$store.getters.IDS;
                let is_pushed = false;
                for (let i = 0; i !== ids.length; i++) {
                    if (ids[i] === key) {
                        is_pushed = true;
                        break;
                    }
                }

                if (!is_pushed) {
                    this.$store.dispatch('UPDATE_IDS', key);
                }

                this.$store.dispatch('UPDATE_OSC_DIALOG', true);
            },
            eventHandleStat: function (key) {
                this.$store.dispatch('UPDATE_STAT_ID', key);
                this.$store.dispatch('UPDATE_STAT_DIALOG', true);
            },
            myRenderChart: function () {
                this.renderChart({
                            labels: this.chartData,
                            datasets: [
                                {
                                    pointRadius: 0,
                                    label: this.chartName,
                                    backgroundColor: 'white',
                                    data: this.chartData,
                                    pointStyle: 'line',
                                    borderWidth: 1,
                                    borderColor: 'black'
                                }
                            ]
                        },
                        {
                            scales: {
                                xAxes: [{
                                    display: false
                                }],
                                yAxes: [{
                                    display: false
                                }]
                            },
                            animation: {
                                duration: 0 // general animation time
                            },
                            hover: {
                                animationDuration: 0 // duration of animations when hovering an item
                            },
                            elements: {
                                line: {
                                    tension: 0 // disables bezier curves
                                }
                            },
                            responsiveAnimationDuration: 0, // animation duration after a resize
                            responsive: true
                        });
            }
        }
    }
</script>

<style scoped>

</style>
