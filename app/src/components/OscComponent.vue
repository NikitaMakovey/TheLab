<template>
    <div>
        <canvas
            style="border: 1px solid black; padding: 1px;"
            ref="canvas" height="150px" width="560px"
        ></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs';

    export default {
        data() {
            return {
                //
            }
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
            //
        },

    }

</script>

<style scoped>

</style>
