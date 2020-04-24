<template>
    <div id="app" @contextmenu.prevent="$refs.menu.open">
        <vue-context ref="menu">
            <li>
                    <v-dialog v-model="aboutDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                        <template v-slot:activator="{ on }">
                            <span v-on="on">Ouscilograma</span>
                        </template>
                        <v-card>
                            <v-toolbar dark color="black">
                                <v-toolbar-title>Ouscilogramma</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-list three-line subheader>
                                <v-subheader class="title">Ouscilogramma of canals</v-subheader>
                                <div>
                                    <v-list-item-content>
                                        <v-list-item-title class="title text--accent-3">Here you can see your canals</v-list-item-title>
                                        <v-list-item-subtitle></v-list-item-subtitle>
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
        components: {
            VueContext
        },
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
            onClick (text) {
                alert(`You clicked ${text}!`);
            }
        },
        
    }

</script>

<style scoped>

</style>
