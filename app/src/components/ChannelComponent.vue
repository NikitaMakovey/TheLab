<template>
    <div id="app" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu">
            <li>
                <v-dialog
                        v-model="oscDialog"
                        max-width="600"
                        hide-overlay
                        persistent
                >
                    <template v-slot:activator="{ on }">
                        <span v-on="on" @click="eventHandle(chartId, on)"><b>осцилограмма</b></span>
                    </template>
                    <v-card>
                        <v-toolbar dark color="black">
                            <v-toolbar-title>Осцилограмма</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-list three-line subheader>
                            <div>
                                <v-list-item-content>
                                    <v-list-item-title class="title text--accent-3">

                                    </v-list-item-title>
                                    <v-list-item-action>

                                    </v-list-item-action>
                                </v-list-item-content>
                            </div>
                        </v-list>
                    </v-card>
                </v-dialog>
            </li>
        </vue-context>
        <canvas height="100" width="200" style="border: 1px solid black; padding: 1px;" ref="canvas"></canvas>
    </div>
</template>

<script>
    import { Line, mixins } from 'vue-chartjs'
    import Vue from 'vue'
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
