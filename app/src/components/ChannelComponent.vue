<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
    import { Line } from 'vue-chartjs'

    export default {
        extends: Line,
        props: ['channeldata', 'channelname'],
        data() {
            return {
                chartdata: {
                    labels: this.channeldata,
                    datasets: [
                        {
                            pointRadius: 0,
                            label: this.channelname,
                            backgroundColor: 'white',
                            data: this.channeldata,
                            pointStyle: 'line',
                            borderWidth: 1,
                            borderColor: 'black'
                        }
                    ]
                },
                options: {
                    responsive: true
                }
            }
        },
        mounted () {
            this.renderChart(this.chartdata, this.options);
        }
    }
</script>

<style scoped>

</style>
