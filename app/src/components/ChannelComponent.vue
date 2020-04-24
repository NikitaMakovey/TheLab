<template>
    <div id="app" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu">
            <li @click="eventHandle(chartId)">
                <span><b>осцилограмма</b></span>
            </li>
        </vue-context>
        <canvas height="100" width="200" style="border: 1px solid black; padding: 1px;" ref="canvas"></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs'
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';

    export default {
        data() {
            return {
                oscDialog: false
            }
        },
        components: {
            VueContext
        },
        extends: Line,
        props: ['chartData', 'chartName', 'chartId'],
        mixins: [mixins.reactiveProp],
        mounted () {
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
                scales:{
                    xAxes: [{
                        display: false
                    }],
                    yAxes: [{
                        display: false
                    }]
                },
                responsive: true
            });
        },
        methods: {
            eventHandle: function (key, event) {
                console.log(key);
                this.oscDialog = true;
            }
        },
        
    }

</script>

<style scoped>

</style>
