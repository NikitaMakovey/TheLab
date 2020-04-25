<template>
    <div @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu" class="px-0">
            <li @click="closeHandle(chartId)">
                <a href="#"><b>закрыть</b></a>
            </li>
            <v-divider/>
            <li>
                <a
                    style="text-decoration-line: none; color: black"
                    href="https://rt.pornhub.com/view_video.php?viewkey=ph5e41af8a75f58"
                ><b>показать nudes 🔥😍💦</b></a>
            </li>
            <li @click="closeDialog">
                <a href="#"><b>выйти погулять 👑🦠</b></a>
            </li>
        </vue-context>
        <canvas
            style="border: 1px solid black; padding: 1px;"
            ref="canvas" height="150px" width="560px"
        ></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs';
    import { VueContext } from 'vue-context'
    import 'vue-context/src/sass/vue-context.scss';

    export default {
        components: {
            VueContext
        },
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
                        data: this.chartData,
                        pointStyle: 'line',
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: 'white',
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
            closeHandle: function (key, event) {
                this.$store.dispatch('DELETE_ITEM_FROM_OSC', key);
            },
            closeDialog: function (event) {
                this.$store.dispatch('UPDATE_OSC_DIALOG', false);
            }
        },

    }

</script>

<style scoped>

</style>
