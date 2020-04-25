<template>
    <div @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu">
            <li @click="eventHandle(chartId)">
                <span><b>осцилограмма</b></span>
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
                let ids = this.$store.getters.IDS;
                let is_pushed = false;
                for (let i = 0; i !== ids.length; i++) {
                    if (ids[i] === key) is_pushed = true;
                }

                if (!is_pushed) {
                    this.$store.dispatch('UPDATE_IDS', key);
                    this.$store.dispatch('UPDATE_OSC_CHANNELS', this.$store.getters.CHANNELS[key]);
                }

                this.$store.dispatch('UPDATE_OSC_DIALOG', true);
            }
        },
        
    }

</script>

<style scoped>

</style>
