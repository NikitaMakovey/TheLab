<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs'

    export default {
        extends: Line,
        props: ['chartData', 'chartName'],
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
                    responsive: true
                });
        }
    }
</script>

<style scoped>

</style>
