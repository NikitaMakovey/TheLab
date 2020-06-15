<template>
  <div>
    <v-system-bar window dark>
      <v-spacer></v-spacer>
      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <router-link to="/">
        <v-icon>mdi-close</v-icon>
      </router-link>
    </v-system-bar>
    <v-system-bar window light style="overflow-x: scroll">

        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    Файл
                </span>
            </template>
            <v-list class="pa-0">
                <v-list-item>
                    <v-list-item-title>
                        <input type="file" @change="loadFile" accept=".txt">
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    Инструменты
                </span>
            </template>
            <v-list class="pa-0">
                <v-list-item>
                    <v-list-item-title @click.stop="infoDialog = fileSource!==null">
                        Инфо
                    </v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title @click.stop="">
                        Фрагмент
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    Осциллограммы
                </span>
            </template>
            <v-list class="pa-0" v-for="(item, index) in this.$store.getters.NAMES" :key="index">

                <v-list-item class="pa-0">
                    <v-list-item-title class="pa-0">
                        <v-checkbox class="pa-2"
                                    @change="menuClickHandle(index)"
                                    v-model="menuItems"
                                    :value="item"
                                    :label="item"></v-checkbox>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <!-- TODO: Menu for modeling -->
        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    Моделирование
                </span>
            </template>
            <v-list class="pa-0">
                <template v-for="(item, i) in generationFunctions">
                    <v-list-item>
                        <v-list-item-title style="text-align: left !important;">
                            {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-action>
                            <v-btn dark class="ma-0 pa-1" @click="item.function">Запуск</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                </template>
            </v-list>
        </v-menu>

        <v-dialog v-model="generationFunctionDialog.status" max-width="600">
            <v-card>
                <v-card-title class="headline" style="font-size: 1rem !important;">
                    {{ generationFunctionDialog.name }}
                </v-card-title>

                <v-simple-table style="background-color: #dbe1f9">
                    <v-data-table-header>
                        <span>Параметры для моделирования</span>
                    </v-data-table-header>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-center">Наименование</th>
                            <th class="text-center">Значение</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(param, index) in generationFunctionDialog.params" :key="index">
                            <td>{{ param.key }}</td>
                            <template v-if="generationFunctionDialog.name === generationFunctions[11].name &&
                                (param.key === 'a' || param.key === 'b')"
                            >
                                <td><input class="form-control" type="text" v-model="param.value"></td>
                            </template>
                            <template v-else>
                                <td><input class="form-control" type="number" v-model="param.value"></td>
                            </template>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="generationFunctionDialog.function">
                        ОК
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- TODO: Menu for modeling END -->




        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <span v-on="on">
                    Статистика
                </span>
            </template>
            <v-list class="pa-0" v-for="(item, index) in this.$store.getters.NAMES" :key="index">

                <v-list-item class="pa-0">
                    <v-list-item-title class="pa-0">
                        <v-checkbox class="pa-2"
                                    @change="menuStatClickHandle(index)"
                                    v-model="menuItems"
                                    :value="item"
                                    :label="item"></v-checkbox>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-dialog v-model="this.$store.getters.STAT_DIALOG"
                  max-width="600"
                  hide-overlay
                  persistent>
            <v-card>
                <v-toolbar dark color="pink">
                    <v-toolbar-title>Статистика</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <label>НАЗВАНИЕ: {{ this.$store.getters.NAMES[this.$store.getters.STAT_ID] }}</label> <br>

                <label>СРЕДНЕЕ: {{ Average }}</label>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1"
                           text
                           @click="$store.dispatch('UPDATE_STAT_DIALOG', false)">
                        ЗАКРЫТЬ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>





        <!-- ABOUT DIALOG -->
        <v-dialog v-model="aboutDialog" fullscreen
                  hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
                <span v-on="on">Справка</span>
            </template>
            <v-card>
                <v-toolbar dark color="black">
                    <v-btn icon dark @click="aboutDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Справка</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="aboutDialog = false">Закрыть</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-list three-line subheader>
                    <v-subheader class="title">Система визуализации многоканальных сигналов</v-subheader>
                    <div>
                        <v-list-item-content>
                            <v-list-item-title class="title text--accent-3">Группа: Б8118-01.03.02систпро</v-list-item-title>
                            <v-list-item-subtitle></v-list-item-subtitle>
                        </v-list-item-content>
                    </div>
                    <div v-for="(person, i) in persons" :key="i" class="ma-0 pa-0">
                        <v-list-item-content class="ma-0 pa-1">
                            <v-list-item-title class="ma-0 pa-0 title text--secondary">{{ person }}</v-list-item-title>
                        </v-list-item-content>
                    </div>
                </v-list>
            </v-card>
        </v-dialog>

        <!-- INFO DIALOG -->
        <v-dialog v-model="infoDialog"
                  max-width="600">
            <v-card>
                <v-card-title class="headline" style="font-size: 1rem !important;">
                    Текущее состояние многоканального сигнала
                </v-card-title>

                <v-card-text>
                    <p class="mb-1">Общее число каналов - {{ infoObject.countChannels }}</p>
                    <p class="mb-1">Общее количество отсчетов - {{ infoObject.countSteps }}</p>
                    <p class="mb-1">Частота дискретизации - {{ infoObject.countGiges }}</p>
                    <p class="mb-1">Дата и время начала записи - {{ $moment(infoObject.startDate).format('LLL') }}</p>
                    <p class="mb-1">Дата и время окончания записи - {{ $moment(infoObject.endDate).format('LLL') }}</p>
                    <p class="mb-1">
                        Длительность:
                        {{ infoObject.date.days }} - суток,
                        {{ infoObject.date.hours }} - часов,
                        {{ infoObject.date.minutes }} - минут,
                        {{ infoObject.date.seconds }} - секунд
                    </p>
                </v-card-text>

                <v-simple-table dark>
                    <v-data-table-header>
                        Информация о каналах
                    </v-data-table-header>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center">№</th>
                                <th class="text-center">Имя</th>
                                <th class="text-center">Источник</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in $store.getters.NAMES" :key="item">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item }}</td>
                                <td>{{ fileSource }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-card-text>
                </v-card-text>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1"
                           text
                           @click="infoDialog = false">
                        ОК
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- OSCILOGRAMM DIALOG -->
        <v-dialog v-model="this.$store.getters.OSC_DIALOG"
                  max-width="600"
                  hide-overlay
                  persistent>
            <v-card>
                <v-toolbar dark color="pink">
                    <v-toolbar-title>Осцилограмма</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <template v-if="this.$store.getters.OSC_CHANNELS !== []">
                    <v-list three-line subheader>
                        <div v-for="(item, index) in this.$store.getters.IDS" :key="index">
                            <v-list-item-content class="pa-0 ma-0">
                                <v-list-item-title class="title text--accent-3 pa-0 ma-0"></v-list-item-title>
                                <v-list-item-action class="pa-2 ma-0">
                                    <osc-component :chartData="$store.getters.OSC_CHANNELS[item]" :chartName="$store.getters.NAMES[item]"
                                                   :chartId="item" :countSteps="infoObject.countSteps" :timeValue="1000.0/infoObject.countGiges"
                                                   :firstDate="infoObject.startDate">
                                    </osc-component>
                                </v-list-item-action>
                            </v-list-item-content>
                        </div>
                    </v-list>
                </template>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1"
                           text
                           @click="$store.dispatch('UPDATE_OSC_DIALOG', false)">
                        ЗАКРЫТЬ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- SUPER DIALOG -->
        <v-dialog v-model="superDialog"
                  max-width="600"
                  hide-overlay
                  persistent>
            <v-card>
                <template v-if="generationFunctionDialog.params.length !== 0">
                    <v-toolbar dark color="pink">
                        <v-toolbar-title>{{ generationFunctionDialog.name }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-list three-line subheader>
                        <v-list-item-content class="pa-0 ma-0">
                            <v-list-item-title class="title text--accent-3 pa-0 ma-0"></v-list-item-title>
                            <v-list-item-action class="pa-2 ma-0">
                                <super-component :chartData="generationFunctionDialog.values"
                                               :chartName="generationFunctionDialog.name"
                                               :chartId="666"
                                               :countSteps="generationFunctionDialog.countSteps"
                                               :timeValue="1000"
                                               :firstDate="Date.now()"
                                ></super-component>
                            </v-list-item-action>
                        </v-list-item-content>
                    </v-list>
                </template>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1"
                           text
                           @click="superDialog = false">
                        ЗАКРЫТЬ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-spacer></v-spacer>
    </v-system-bar>

    <v-col cols="12">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="8">

        </v-col>
        <v-col cols="2">
          <template v-if="this.$store.getters.CHANNELS.length !== 0">
            <div style="width: 201px; border: 1px solid black; border-radius: 5px;" class="ma-0 pa-0">
              <v-subheader class="ma-0 pa-2 title ">Каналы</v-subheader>
              <v-row
                      v-for="(data, index) in this.$store.getters.CHANNELS"
                      :key="index" class="pa-0 ma-0"
              >
                <channel-component
                        :chartData="data" :chartName="$store.getters.NAMES[index]"
                        :chartId="index"
                >
                </channel-component>
              </v-row>
            </div>
          </template>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

    </v-col>
  </div>
</template>

<script>
  import ChannelComponent from "@/components/ChannelComponent";
  import OscComponent from "@/components/OscComponent";
  import SuperComponent from "@/components/SuperComponent";

  export default {
      name: "ComputerGraphicsComponent",
      components: {
          'channel-component': ChannelComponent,
          'osc-component': OscComponent,
          'super-component': SuperComponent,
      },
      data() {
          return {
              generationFunctionDialog: {
                  'status': false,
                  'name': '',
                  'function': null,
                  'params': [],
                  'values': [],
                  'countSteps': 0,
              },
              generationFunctions: [
                  {
                      'name': 'Задержанный единичный импульс',
                      'function': this.functionForModeling1,
                  },
                  {
                      'name': 'Задержанный единичный скачок',
                      'function': this.functionForModeling2,
                  },
                  {
                      'name': 'Дискретизированная убывающая экспонента',
                      'function': this.functionForModeling3,
                  },
                  {
                      'name': 'Дискретизированная синусоида',
                      'function': this.functionForModeling4,
                  },
                  {
                      'name': '«Mеандр» (прямоугольная решетка) с периодом L',
                      'function': this.functionForModeling5,
                  },
                  {
                      'name': '“Пила” с периодом L',
                      'function': this.functionForModeling6,
                  },
                  {
                      'name': 'Сигнал с экспоненциальной огибающей - амплитудная модуляция',
                      'function': this.functionForModeling7,
                  },
                  {
                      'name': 'Сигнал с балансной огибающей - амплитудная модуляция',
                      'function': this.functionForModeling8,
                  },
                  {
                      'name': 'Сигнал с тональной огибающей. - амплитудная модуляция',
                      'function': this.functionForModeling9,
                  },
                  {
                      'name': 'Сигнала белого шума, равномерно распределенного в интервале [a,b]',
                      'function': this.functionForModeling10,
                  },
                  {
                      'name': 'Сигнала белого шума, распределенного по нормальному закону с заданными средним и дисперсией',
                      'function': this.functionForModeling11,
                  },
                  {
                      'name': 'Случайного сигнал авторегрессии-скользящего среднего порядка (p,q) – АРСС (p,q)',
                      'function': this.functionForModeling12,
                  },
              ],
              menuItems: [],
              persons: [
                  'Маковей Никита',
                  'Романенкова Людмила',
                  'Лоншакова Анастасия',
                  'Ващенко Светлана',
                  'Гасанова Сабина',
              ],
              aboutDialog: false,
              infoDialog: false,
              superDialog: false,

              infoObject: {
                  countChannels: null,
                  countSteps: null,
                  countGiges: null,
                  startDate: null,
                  endDate: null,
                  date: {
                      days: null,
                      hours: null,
                      minutes: null,
                      seconds: null
                  }
              },

              fileSource: null

          }
      },
      methods: {
          functionForRandomization: function (a, b) {
              return (a + (b - a) * Math.random())
          },
          functionForNormalRandomization: function (a, q) {
              let s = 0;
              for (let i = 0; i < 12; i++) {
                  s += Math.random();
              }
              return (a + Math.sqrt(q) * (s - 6))
          },
          functionForReplacing: function (channelArray) {
              let NAMES = this.$store.getters.NAMES;
              NAMES.push(this.generationFunctionDialog.name);
              this.$store.dispatch('UPDATE_CHANNEL_NAMES', NAMES);
              let CHANNELS = this.$store.getters.CHANNELS;
              CHANNELS.push(channelArray);
              this.$store.dispatch('UPDATE_CHANNELS', CHANNELS);
          },
          functionForGeneration1: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let n0 = 1 * this.generationFunctionDialog.params[1].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  if (i === n0) {
                      channelArray.push(1);
                  } else {
                      channelArray.push(0);
                  }
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration2: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let n0 = 1 * this.generationFunctionDialog.params[1].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  if (i < n0) {
                      channelArray.push(0);
                  } else {
                      channelArray.push(1);
                  }
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration3: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let a = 1.0 * this.generationFunctionDialog.params[1].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  channelArray.push(Math.pow(a, i));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration4: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let a = 1.0 * this.generationFunctionDialog.params[1].value;
              let omega = 1.0 * this.generationFunctionDialog.params[2].value;
              let fi = 1.0 * this.generationFunctionDialog.params[3].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  channelArray.push(a * Math.sin(i * omega + fi));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration5: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              // if double value the {value} * 1.0
              // if int value the {value} * 1
              // if you will do it then you may use '===' instead of '=='
              // it's javascript, babe :)
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let L = 1.0 * this.generationFunctionDialog.params[1].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  if ((i % L) < L / 2) {
                      channelArray.push(1);
                  } else {
                      channelArray.push(-1);
                  }
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration6: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let L = 1.0 * this.generationFunctionDialog.params[1].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  channelArray.push((i % L) / L);
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration7: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let fd = 1.0 * this.generationFunctionDialog.params[0].value;
              let T = 1.0 * this.generationFunctionDialog.params[1].value;
              let t = 1 * this.generationFunctionDialog.params[2].value;
              let a = 1.0 * this.generationFunctionDialog.params[3].value;
              let tau = 1.0 * this.generationFunctionDialog.params[4].value;
              let f = 1.0 * this.generationFunctionDialog.params[5].value;
              let fi = 1.0 * this.generationFunctionDialog.params[6].value;
              let channelArray = [];
              for (let i = 0; i <= t; i++) {
                  channelArray.push(a * Math.exp(-i / tau) * Math.cos(2 * Math.PI * f * i + fi));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = t;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration8: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let fd = 1.0 * this.generationFunctionDialog.params[0].value;
              let T = 1.0 * this.generationFunctionDialog.params[1].value;
              let t = 1 * this.generationFunctionDialog.params[2].value;
              let a = 1.0 * this.generationFunctionDialog.params[3].value;
              let f0 = 1.0 * this.generationFunctionDialog.params[4].value;
              let fn = 1.0 * this.generationFunctionDialog.params[5].value;
              let fi = 1.0 * this.generationFunctionDialog.params[6].value;
              let channelArray = [];
              for (let i = 0; i <= t; i++) {
                  channelArray.push(a * Math.cos(2 * Math.PI * f0 * i) * Math.cos(2 * Math.PI * fn * i + fi));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = t;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration9: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let fd = 1.0 * this.generationFunctionDialog.params[0].value;
              let T = 1.0 * this.generationFunctionDialog.params[1].value;
              T = 1.0 / fd;
              let t = 1 * this.generationFunctionDialog.params[2].value;
              let a = 1.0 * this.generationFunctionDialog.params[3].value;
              let m = 1.0 * this.generationFunctionDialog.params[4].value;
              let f0 = 1.0 * this.generationFunctionDialog.params[5].value;
              let fn = 1.0 * this.generationFunctionDialog.params[6].value;
              let fi = 1.0 * this.generationFunctionDialog.params[7].value;
              let channelArray = [];
              for (let i = 0; i < t; i++) {
                  channelArray.push(a * (1 + m * Math.cos(2 * Math.PI * f0 * T * i)) * Math.cos(2 * Math.PI * fn * T * i + fi));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = t - 1;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration10: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let a = 1 * this.generationFunctionDialog.params[1].value;
              let b = 1 * this.generationFunctionDialog.params[2].value;
              console.log(a, b);
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  channelArray.push(this.functionForRandomization(a, b));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration11: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;
              let n = 1 * this.generationFunctionDialog.params[0].value;
              let a = 1 * this.generationFunctionDialog.params[1].value;
              let sigma = 1 * this.generationFunctionDialog.params[2].value;
              let channelArray = [];
              for (let i = 0; i <= n; i++) {
                  channelArray.push(this.functionForNormalRandomization(a, sigma));
              }
              console.log(channelArray);
              this.generationFunctionDialog.countSteps = n;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForGeneration12: function (...params) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;

              let n = 1.0 * this.generationFunctionDialog.params[0].value;
              let p = 1 * this.generationFunctionDialog.params[1].value;
              let q = 1 * this.generationFunctionDialog.params[2].value;
              let sigma = 1 * this.generationFunctionDialog.params[3].value;

              let channelArray = [];

              let aArray; //= [-4.167, 7.940, -9.397, 7.515, -3.752, 0.862];
              let bArray;// = [-2.28, 1.77, -0.472];
              if (this.generationFunctionDialog.params[4].value.length > 0) {
                  aArray = this.generationFunctionDialog.params[4].value.split(', ')
              }
              if (this.generationFunctionDialog.params[5].value.length > 0) {
                  bArray = this.generationFunctionDialog.params[5].value.split(', ')
              }
              console.log(aArray);
              console.log(bArray);
              let xArray = [];
              let yArray = [];

              // console.log(aArray);
              // console.log(bArray);

              for (let j = 0; j < n; j++) {
                  let sum1 = 0;
                  let sum2 = 0;
                  xArray.push(this.functionForNormalRandomization(0, sigma));

                  for (let i = 0; i < q; i++) {
                      if ((j - i) > 0) {
                          sum1 += bArray[i] * xArray[j - i - 1];
                      }
                  }

                  if (j > 0) {
                      for (let i = 0; i < p; i++) {
                          //if (((j - i) > 0) && (j - i < j)) {
                          if ((j - i) > 0) {
                              sum2 += aArray[i] * yArray[j - i - 1];
                          }
                          //}
                      }
                  }

                  yArray.push(xArray[j] + sum1 - sum2);
                  channelArray.push(xArray[j] + sum1 - sum2);
              }
              console.table(xArray);
              this.generationFunctionDialog.countSteps = n - 1;
              this.generationFunctionDialog.values = channelArray;
              this.functionForReplacing(channelArray);
              //setTimeout(() => { this.superDialog = true; }, 1000);
          },
          functionForModeling1: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[0].name;
              this.generationFunctionDialog.function = this.functionForGeneration1;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 100
                  },
                  {
                      'key': 'n0',
                      'value': 50
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling2: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[1].name;
              this.generationFunctionDialog.function = this.functionForGeneration2;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 100
                  },
                  {
                      'key': 'n0',
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling3: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[2].name;
              this.generationFunctionDialog.function = this.functionForGeneration3;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 10
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling4: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[3].name;
              this.generationFunctionDialog.function = this.functionForGeneration4;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 50
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': '\u03C9 (π)',
                      'value': 0
                  },
                  {
                      'key': '\u03C6 (π)',
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling5: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[4].name;
              this.generationFunctionDialog.function = this.functionForGeneration5;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 100
                  },
                  {
                      'key': 'L',
                      'value': 20
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling6: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[5].name;
              this.generationFunctionDialog.function = this.functionForGeneration6;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 100
                  },
                  {
                      'key': 'L',
                      'value': 20
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling7: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[6].name;
              this.generationFunctionDialog.function = this.functionForGeneration7;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'fd',
                      'value': 0
                  },
                  {
                      'key': 'T',
                      'value': 0
                  },
                  {
                      'key': 't',
                      'value': 0
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': '\u03C4', //тетта
                      'value': 0
                  },
                  {
                      'key': 'f',
                      'value': 0
                  },
                  {
                      'key': '\u03C6', //фи
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling8: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[7].name;
              this.generationFunctionDialog.function = this.functionForGeneration8;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'fd',
                      'value': 0
                  },
                  {
                      'key': 'T',
                      'value': 0
                  },
                  {
                      'key': 't',
                      'value': 0
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': 'f0',
                      'value': 0
                  },
                  {
                      'key': 'fн',
                      'value': 0
                  },
                  {
                      'key': '\u03C6', //фи
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling9: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[8].name;
              this.generationFunctionDialog.function = this.functionForGeneration9;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'fd',
                      'value': 0
                  },
                  {
                      'key': 'T',
                      'value': 0
                  },
                  {
                      'key': 't',
                      'value': 0
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': 'm',
                      'value': 0
                  },
                  {
                      'key': 'f0',
                      'value': 0
                  },
                  {
                      'key': 'fн',
                      'value': 0
                  },
                  {
                      'key': '\u03C6', //фи
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling10: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[9].name;
              this.generationFunctionDialog.function = this.functionForGeneration10;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 0
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': 'b',
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling11: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[10].name;
              this.generationFunctionDialog.function = this.functionForGeneration11;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 0
                  },
                  {
                      'key': 'a',
                      'value': 0
                  },
                  {
                      'key': '\u03C3^2',
                      'value': 0
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          functionForModeling12: function (...params) {
              this.generationFunctionDialog.name = this.generationFunctions[11].name;
              this.generationFunctionDialog.function = this.functionForGeneration12;
              this.generationFunctionDialog.params = [
                  {
                      'key': 'n',
                      'value': 10
                  },
                  {
                      'key': 'p',
                      'value': 6
                  },
                  {
                      'key': 'q',
                      'value': 3
                  },
                  {
                      'key': '\u03C3^2',
                      'value': 1
                  },
                  {
                      'key': 'a',
                      'value': '-4.167, 7.940, -9.397, 7.515, -3.752, 0.862'
                  },
                  {
                      'key': 'b',
                      'value': '-2.28, 1.77, -0.472'
                  },
              ];
              this.generationFunctionDialog.status = true;
          },
          menuStatusHandle: function (key) {
              let ids = this.$store.getters.IDS;
              let is_pushed = false;
              for (let i = 0; i !== ids.length; i++) {
                  if (ids[i] === key) is_pushed = true;
              }
              return is_pushed;
          },
          menuClickHandle: function (key, event) {
              if (this.menuStatusHandle(key)) {
                  this.menuCloseHandle(key, event);
              } else {
                  this.menuEventHandle(key, event);
              }
          },
          menuStatClickHandle: function (key, event) {
              this.$store.dispatch('UPDATE_STAT_DIALOG', true);
              this.$store.dispatch('UPDATE_STAT_ID', key);
          },
          menuCloseHandle: function (key, event) {
              this.$store.dispatch('DELETE_ITEM_FROM_OSC', key).then(() => {
                  if (this.$store.getters.IDS.length === 0) {
                      this.$store.dispatch('UPDATE_OSC_DIALOG', false);
                  }
              })
          },
          menuEventHandle: function (key, event) {
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
          },
          showInfo: function () {
              //
          },
          loadFile: function (e) {
              this.$store.dispatch('UPDATE_CHANNELS', null).then(() => {
                  const file = e.target.files[0];

                  let fileType = file.type;
                  this.fileSource = file.name;

                  if (fileType === "text/plain") {
                      this.readFile(file);
                  }
              });
          },
          readFile: function (file) {
              this.$store.dispatch('CLEAR_OSC');
              this.$store.dispatch('UPDATE_OSC_DIALOG', false);
              let CHANNELS = null;
              const reader = new FileReader();
              const store = this.$store;
              const vm = this;
              let infoObject = this.infoObject;
              reader.onload = function () {
                  let cnt = 0;
                  const DATA = reader.result.split("\n").filter(x => x.length !== 0).map(function (d) {
                      let delta = d.trim().split(" ");

                      if (cnt < 12) {

                          if (cnt === 1) {
                              let countChannels = Number(delta[0]);
                              if (countChannels > 0 && countChannels !== null) {
                                  infoObject.countChannels = countChannels;
                                  CHANNELS = new Array(countChannels);
                                  for (let i = 0; i < countChannels; i++) {
                                      CHANNELS[i] = new Array(0);
                                  }
                              }
                          }

                          if (cnt === 3) {
                              infoObject.countSteps = Number(delta[delta.length - 1]);
                          }

                          if (cnt === 5) {
                              infoObject.countGiges = Number(delta[delta.length - 1]);
                          }

                          if (cnt === 7) {
                              infoObject.startDate = delta[0];
                          }

                          if (cnt === 9) {
                              let dateBeforeSpace = (infoObject.startDate).split('-');
                              let dateAfterSpace = ((delta[0].split('.'))[0]).split(':');
                              let time = 1000 * (infoObject.countSteps * (1.0 / infoObject.countGiges));
                              console.log(time);

                              let year = Number(dateBeforeSpace[2]);
                              let month = Number(dateBeforeSpace[1]);
                              let day = Number(dateBeforeSpace[0]);
                              let hour = Number(dateAfterSpace[0]);
                              let minute = Number(dateAfterSpace[1]);
                              let second = Number(dateAfterSpace[2]);

                              let startDate = new Date(year, month, day, hour, minute, second);
                              let endDate = new Date(year, month, day, hour, minute, second);
                              endDate.setSeconds(endDate.getSeconds(), parseInt(time.toString()));

                              infoObject.startDate = startDate;
                              infoObject.endDate = endDate;

                              let difference = endDate - startDate;

                              infoObject.date.days =
                                  parseInt((difference / (1000 * 60 * 60 * 24)).toString());
                              infoObject.date.hours =
                                  parseInt(((difference / (1000 * 60 * 60)) % 24).toString());
                              infoObject.date.minutes =
                                  parseInt(((difference / (1000 * 60)) % 60).toString());
                              infoObject.date.seconds =
                                  parseInt(((difference / 1000) % 60).toString());
                          }

                          if (cnt === 11) {
                              const CHANNELS_NAMES = d.split(";");
                              store.dispatch('UPDATE_CHANNEL_NAMES', CHANNELS_NAMES);
                          }
                      } else {
                          for (let i = 0; i < infoObject.countChannels; i++) {
                              CHANNELS[i].push(Number(delta[i]));
                          }
                      }
                      cnt++;
                  });
                  store.dispatch('UPDATE_CHANNELS', CHANNELS).then(() => {
                      vm.drawChannels();
                  })
              };
              reader.readAsText(file);
          },
          drawChannels: function () {
              // TODO: something...
          }
      },
      computed: {
          Average: function () {
              let channelId = this.$store.getters.STAT_ID;
              let avgSum = 0;
              let channels = this.$store.getters.CHANNELS;

              if (channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  for (let i = 0; i < channels[channelId].length; i++) {
                      avgSum += channels[channelId][i];
                  }
                  avgSum /= channels[channelId].length;
              }

              return avgSum;
          }
      }
  }
</script>

<style scoped>
  span {
    margin-left: 1rem;
    margin-right: 1rem;
  }
</style>
