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
                    <v-list-item-title @click.stop="infoDialog = (infoObject.sources.length !== 0)">
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
                <template v-for="(item, index) in generationFunctions">
                    <v-list-item>
                        <v-list-item-title style="text-align: left !important;">
                            {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-action>
                            <v-btn dark class="ma-0 pa-1" @click="functionForModeling(index)">Запуск</v-btn>
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

                <label>Название: {{ this.$store.getters.NAMES[this.$store.getters.STAT_ID] }}</label> <br>

                <label>Среднее: {{ Average.toFixed(3) }}</label> <br>

                <label>Дисперсия σ^2: {{ Dispersion.toFixed(3) }}</label> <br>

                <label>Среднеквадратичное отклонение σ: {{ AvgDeviation.toFixed(3) }}</label><br>

                <label>Коэффициент вариации r: {{ Variation.toFixed(3) }}</label> <br>

                <label>Коэффициент асимметрии &gamma; {{ Asymmetry.toFixed(3) }}</label> <br>

                <label>Коэффициент эксцесса к: {{ Excess.toFixed(3) }} </label> <br>

                <label>Минимальное значение сигнала: {{ Min.toFixed(3) }}</label> <br>

                <label>Максимальное значение сигнала: {{ Max.toFixed(3) }}</label> <br>

                <label>Квантиль порядка 0.05: {{ Quantile1.toFixed(3) }}</label> <br>

                <label>Квантиль порядка 0.95: {{ Quantile2.toFixed(3) }}</label> <br>

                <label>Медиана: {{ Median.toFixed(3) }}</label>

                <HistogramComponent :chart-data="this.$store.getters.CHANNELS[this.$store.getters.STAT_ID]"></HistogramComponent>

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

        <v-dialog :transition="false" v-model="this.$store.getters.ANALYZE_DIALOG"
                  max-width="600"
                  hide-overlay
                  persistent>
            <v-card>
                <v-toolbar dark color="pink">
                    <v-toolbar-title>Анализ</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-card-text>
                    <v-select
                            v-model="typeAnalyzer"
                            :items="itemsTypeAnalyzer"
                            label="тип рассчитываемой спектральной характеристики"
                    ></v-select>
                </v-card-text>

                <v-card-text>
                    <v-select
                            v-model="zeroModeAnalyzer"
                            :items="itemsZeroModeAnalyzer"
                            label="режим разрешения коллизии по поводу нулевого отсчета "
                    ></v-select>
                </v-card-text>

                <v-card-text>
                    <v-text-field v-model="halfWindowL" label="полуширина окна сглаживания"></v-text-field>
                </v-card-text>

                <v-spacer></v-spacer>

                <template v-if="this.$store.getters.ANALYZE_IDS !== []">
                    <v-list three-line subheader>
                        <div v-for="(item, index) in this.$store.getters.ANALYZE_IDS" :key="index">
                            <v-list-item-content class="pa-0 ma-0">
                                <v-list-item-title class="title text--accent-3 pa-0 ma-0"></v-list-item-title>
                                <v-list-item-action class="pa-2 ma-0">
                                    <AnalyzerComponent
                                            :chart-id="item"
                                            :chart-data="$store.getters.CHANNELS[item]"
                                            :sample-rate="infoObject.countGiges"
                                            :zero-mode="IdxZeroModeAnalyzer"
                                            :scaling-mode="IdxTypeAnalyzer"
                                            :smoothing-length="GetHalfWindowL"
                                    ></AnalyzerComponent>
                                </v-list-item-action>
                            </v-list-item-content>
                        </div>
                    </v-list>
                </template>

                <v-card-actions class="pa-4 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1"
                           text
                           @click="$store.commit('REFRESH_ANALYZE_DIALOG', false)">
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
                                <td>{{ infoObject.sources[index] }}</td>
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
        <v-dialog :transition="false" v-model="this.$store.getters.OSC_DIALOG"
                  max-width="600"
                  hide-overlay
                  persistent>
            <v-card>
                <v-toolbar dark color="pink">
                    <v-toolbar-title>Осцилограмма</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <template v-if="this.$store.getters.IDS !== []">
                    <v-list three-line subheader>
                        <div v-for="(item, index) in this.$store.getters.IDS" :key="index">
                            <v-list-item-content class="pa-0 ma-0">
                                <v-list-item-title class="title text--accent-3 pa-0 ma-0"></v-list-item-title>
                                <v-list-item-action class="pa-2 ma-0">
                                    <osc-component :chartData="$store.getters.CHANNELS[item]"
                                                   :chartName="$store.getters.NAMES[item]"
                                                   :chartId="item"
                                                   :countSteps="infoObject.countSteps"
                                                   :timeValue="1000.0 / infoObject.countGiges"
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
          <template v-if="this.$store.getters.CHANNELS !== null && this.$store.getters.CHANNELS.length !== 0">
            <div style="width: 201px; border: 1px solid black; border-radius: 5px;" class="ma-0 pa-0">
              <v-subheader class="ma-0 pa-2 title ">Каналы</v-subheader>
              <v-row
                      v-for="(data, index) in this.$store.getters.CHANNELS"
                      :key="index" class="pa-0 ma-0"
              >
                <channel-component
                        :chartData="data"
                        :chartName="$store.getters.NAMES[index]"
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
  import ChannelComponent from "../components/ChannelComponent";
  import OscComponent from "../components/OscComponent";
  import SuperComponent from "../components/SuperComponent";
  import HistogramComponent from "../components/HistogramComponent";
  import AnalyzerComponent from "../components/AnalyzerComponent";

  import modeling from "../modeling/modeling.js";

  export default {
      name: "ComputerGraphicsComponent",
      components: {
          AnalyzerComponent,
          HistogramComponent,
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
                      'function': this.functionForGeneration1,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 100},
                          {'key': 'n0', 'value': 50}
                      ]
                  },
                  {
                      'name': 'Задержанный единичный скачок',
                      'function': this.functionForGeneration2,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 100},
                          {'key': 'n0', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Дискретизированная убывающая экспонента',
                      'function': this.functionForGeneration3,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 10},
                          {'key': 'a', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Дискретизированная синусоида',
                      'function': this.functionForGeneration4,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 50},
                          {'key': 'a', 'value': 0},
                          {'key': '\u03C9 (π)', 'value': 0},
                          {'key': '\u03C6 (π)', 'value': 0}
                      ]
                  },
                  {
                      'name': '«Mеандр» (прямоугольная решетка) с периодом L',
                      'function': this.functionForGeneration5,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 100},
                          {'key': 'L', 'value': 20}
                      ]
                  },
                  {
                      'name': '“Пила” с периодом L',
                      'function': this.functionForGeneration6,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 100},
                          {'key': 'L', 'value': 20}
                      ]
                  },
                  {
                      'name': 'Сигнал с экспоненциальной огибающей - амплитудная модуляция',
                      'function': this.functionForGeneration7,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 't', 'value': 0},
                          {'key': 'a', 'value': 0},
                          {'key': '\u03C4', 'value': 0},
                          {'key': 'f', 'value': 0},
                          {'key': '\u03C6', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Сигнал с балансной огибающей - амплитудная модуляция',
                      'function': this.functionForGeneration8,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 't', 'value': 0},
                          {'key': 'a', 'value': 0},
                          {'key': 'f0', 'value': 0},
                          {'key': 'fн', 'value': 0},
                          {'key': '\u03C6', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Сигнал с тональной огибающей. - амплитудная модуляция',
                      'function': this.functionForGeneration9,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 't', 'value': 0},
                          {'key': 'a', 'value': 0},
                          {'key': 'm', 'value': 0},
                          {'key': 'f0', 'value': 0},
                          {'key': 'fн', 'value': 0},
                          {'key': '\u03C6', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Сигнала белого шума, равномерно распределенного в интервале [a,b]',
                      'function': this.functionForGeneration10,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 0},
                          {'key': 'a', 'value': 0},
                          {'key': 'b', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Сигнала белого шума, распределенного по нормальному закону с заданными средним и дисперсией',
                      'function': this.functionForGeneration11,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 0},
                          {'key': 'a', 'value': 0},
                          {'key': '\u03C3^2', 'value': 0}
                      ]
                  },
                  {
                      'name': 'Случайного сигнал авторегрессии-скользящего среднего порядка (p,q) – АРСС (p,q)',
                      'function': this.functionForGeneration12,
                      'params': [
                          {'key': 'Sample Rate', 'value': 1},
                          {'key': 'n', 'value': 10},
                          {'key': 'p', 'value': 6},
                          {'key': 'q', 'value': 3},
                          {'key': '\u03C3^2', 'value': 1},
                          {'key': 'a', 'value': '-4.167, 7.940, -9.397, 7.515, -3.752, 0.862'},
                          {'key': 'b', 'value': '-2.28, 1.77, -0.472'}
                      ]
                  },
              ],

              persons: [
                  'Маковей Никита',
                  'Романенкова Людмила',
                  'Лоншакова Анастасия',
                  'Ващенко Светлана',
                  'Гасанова Сабина'
              ],

              aboutDialog: false,
              infoDialog: false,
              superDialog: false,

              infoObject: {
                  countChannels: 0,
                  sources: [],
                  countSteps: 0,
                  countGiges: 0,
                  startDate: new Date(0),
                  endDate: new Date(0),
                  date: {
                      days: 0,
                      hours: 0,
                      minutes: 0,
                      seconds: 0
                  }
              },
              chart: null,

              itemsZeroModeAnalyzer: ['ничего не делать', 'уровнять с модулем соседнего отсчета', 'обнулить'],
              itemsTypeAnalyzer: ['амплитудный спектр', 'амплитудный спектр (логарифмический режим)', 'СПМ', 'СПМ (логарифмический режим)'],
              zeroModeAnalyzer: 'уровнять с модулем соседнего отсчета',
              typeAnalyzer: 'амплитудный спектр',
              halfWindowL: "0"
          }
      },
      methods: {
          functionForReplacing: function (channelArray, sampleRate) {
              let NAMES = [];
              let CHANNELS = [];

              if (channelArray.length === this.infoObject.countSteps &&
                    sampleRate === this.infoObject.countGiges) {
                  NAMES = this.$store.getters.NAMES;
                  CHANNELS = this.$store.getters.CHANNELS;

                  this.infoObject.countChannels++;
                  this.infoObject.sources.push("Modeling");
              } else {
                  this.$store.commit('REFRESH_OSC');
                  this.$store.commit('REFRESH_STAT_DIALOG', false);
                  this.$store.commit('REFRESH_ANALYZE');

                  this.infoObject = {
                      countChannels: 1,
                      sources: ["Modeling"],
                      countSteps: channelArray.length,
                      countGiges: sampleRate,
                      startDate: new Date(0),
                      endDate: new Date(0),
                      date: { days: 0, hours: 0, minutes: 0, seconds: 0 }
                  };
              }

              NAMES.push(this.generationFunctionDialog.name);
              CHANNELS.push(channelArray);

              this.$store.dispatch('UPDATE_CHANNEL_NAMES', NAMES);
              this.$store.dispatch('UPDATE_CHANNELS', CHANNELS);
          },
          functionForGeneration: function (parseFunc) {
              this.superDialog = false;
              this.generationFunctionDialog.values = [];
              this.generationFunctionDialog.status = false;

              const channel = parseFunc()

              this.generationFunctionDialog.countSteps = channel.values.length;
              this.generationFunctionDialog.values = channel.values;
              this.functionForReplacing(channel.values, channel.sampleRate);
          },
          functionForGeneration1: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let n0 = 1 * this.generationFunctionDialog.params[2].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration1(n, n0)};
              });
          },
          functionForGeneration2: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let n0 = 1 * this.generationFunctionDialog.params[2].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration2(n, n0)};
              });
          },
          functionForGeneration3: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1.0 * this.generationFunctionDialog.params[2].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration3(n, a)};
              });
          },
          functionForGeneration4: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1.0 * this.generationFunctionDialog.params[2].value;
                  let omega = 1.0 * this.generationFunctionDialog.params[3].value;
                  let fi = 1.0 * this.generationFunctionDialog.params[4].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration4(n, a, omega, fi)};
              });
          },
          functionForGeneration5: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let L = 1.0 * this.generationFunctionDialog.params[2].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration5(n, L)};
              });
          },
          functionForGeneration6: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let L = 1.0 * this.generationFunctionDialog.params[2].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration6(n, L)};
              });
          },
          functionForGeneration7: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let t = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1.0 * this.generationFunctionDialog.params[2].value;
                  let tau = 1.0 * this.generationFunctionDialog.params[3].value;
                  let f = 1.0 * this.generationFunctionDialog.params[4].value;
                  let fi = 1.0 * this.generationFunctionDialog.params[5].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration7(fd, t, a, tau, f, fi)};
              });
          },
          functionForGeneration8: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let t = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1.0 * this.generationFunctionDialog.params[2].value;
                  let f0 = 1.0 * this.generationFunctionDialog.params[3].value;
                  let fn = 1.0 * this.generationFunctionDialog.params[4].value;
                  let fi = 1.0 * this.generationFunctionDialog.params[5].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration8(fd, t, a, f0, fn, fi)};
              });
          },
          functionForGeneration9: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let t = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1.0 * this.generationFunctionDialog.params[2].value;
                  let m = 1.0 * this.generationFunctionDialog.params[3].value;
                  let f0 = 1.0 * this.generationFunctionDialog.params[4].value;
                  let fn = 1.0 * this.generationFunctionDialog.params[5].value;
                  let fi = 1.0 * this.generationFunctionDialog.params[6].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration9(fd, t, a, m, f0, fn, fi)};
              });
          },
          functionForGeneration10: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1 * this.generationFunctionDialog.params[2].value;
                  let b = 1 * this.generationFunctionDialog.params[3].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration10(n, a, b)};
              });
          },
          functionForGeneration11: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1 * this.generationFunctionDialog.params[1].value;
                  let a = 1 * this.generationFunctionDialog.params[2].value;
                  let sigma = 1 * this.generationFunctionDialog.params[3].value;

                  return {sampleRate: fd, values: modeling.functionForGeneration11(n, a, sigma)};
              });
          },
          functionForGeneration12: function () {
              this.functionForGeneration(() => {
                  let fd = 1.0 * this.generationFunctionDialog.params[0].value;
                  let n = 1.0 * this.generationFunctionDialog.params[1].value;
                  let p = 1 * this.generationFunctionDialog.params[2].value;
                  let q = 1 * this.generationFunctionDialog.params[3].value;
                  let sigma = 1 * this.generationFunctionDialog.params[4].value;

                  let aArray = [];
                  let bArray = [];
                  if (this.generationFunctionDialog.params[5].value.length > 0) {
                      aArray = this.generationFunctionDialog.params[5].value.split(', ')
                  }
                  if (this.generationFunctionDialog.params[6].value.length > 0) {
                      bArray = this.generationFunctionDialog.params[6].value.split(', ')
                  }

                  return {sampleRate: fd, values: modeling.functionForGeneration12(n, p, q, sigma, aArray, bArray)};
              });
          },
          functionForModeling: function (idx) {
              this.generationFunctionDialog.name = this.generationFunctions[idx].name;
              this.generationFunctionDialog.function = this.generationFunctions[idx].function;
              this.generationFunctionDialog.params = this.generationFunctions[idx].params;
              this.generationFunctionDialog.status = true;
          },
          menuStatusHandle: function (key) {
              const ids = this.$store.getters.IDS;

              for (let i = 0; i !== ids.length; i++) {
                  if (ids[i] === key) {
                      return true;
                  }
              }

              return false;
          },
          menuClickHandle: function (key, event) {
              if (this.menuStatusHandle(key)) {
                  this.menuCloseHandle(key, event);
              } else {
                  this.menuEventHandle(key, event);
              }
          },
          menuStatClickHandle: function (key) {
              this.$store.dispatch('UPDATE_STAT_DIALOG', true);
              this.$store.dispatch('UPDATE_STAT_ID', key);
          },
          menuCloseHandle: function (key) {
              this.$store.dispatch('DELETE_ITEM_FROM_OSC', key).then(() => {
                  if (this.$store.getters.IDS.length === 0) {
                      this.$store.dispatch('UPDATE_OSC_DIALOG', false);
                  }
              })
          },
          menuEventHandle: function (key) {
              const ids = this.$store.getters.IDS;
              let is_pushed = false;
              for (let i = 0; i !== ids.length; i++) {
                  if (ids[i] === key) {
                      is_pushed = true;
                      break;
                  }
              }

              if (!is_pushed) {
                  this.$store.dispatch('UPDATE_IDS', key).then(() => {
                      this.$store.dispatch('UPDATE_OSC_DIALOG', true);
                  });
              }
          },
          loadFile: function (e) {
              const file = e.target.files[0];

              let fileType = file.type;

              if (fileType === "text/plain") {
                  this.readFile(file);
              }
          },
          readFile: function (file) {
              this.$store.commit('REFRESH_OSC');
              this.$store.commit('REFRESH_STAT_DIALOG', false);
              this.$store.commit('REFRESH_ANALYZE');

              let NAMES = [];
              let CHANNELS = [];

              const reader = new FileReader();
              const store = this.$store;
              const vm = this;
              let infoObject = {
                  countChannels: 0,
                  sources: [],
                  countSteps: 0,
                  countGiges: 0,
                  startDate: new Date(0),
                  endDate: new Date(0),
                  date: {
                      days: 0,
                      hours: 0,
                      minutes: 0,
                      seconds: 0
                  }
              };

              reader.onload = function () {
                  reader.result.split("\n").filter(x => x.length !== 0).forEach(function (d, cnt) {
                      let delta = d.trim().split(" ");

                      if (cnt < 12) {

                          if (cnt === 1) {
                              const countChannels = Number(delta[0]);

                              if (countChannels > 0 && countChannels !== null) {
                                  infoObject.countChannels = countChannels;
                                  CHANNELS = new Array(countChannels);

                                  for (let i = 0; i < countChannels; i++) {
                                      CHANNELS[i] = new Array(0);
                                      infoObject.sources.push(file.name);
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
                              NAMES = d.split(";");
                          }
                      } else {
                          for (let i = 0; i < infoObject.countChannels; i++) {
                              CHANNELS[i].push(Number(delta[i]));
                          }
                      }
                  });

                  vm.infoObject = infoObject;

                  store.dispatch('UPDATE_CHANNEL_NAMES', NAMES);
                  store.dispatch('UPDATE_CHANNELS', CHANNELS)
              };

              reader.readAsText(file);
          },
          OrderStatistic: function (p) {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  let channelSort = [...channels[channelId]].sort();

                  return channelSort[Math.floor(p * channels[channelId].length)];
              }

              return 0;
          }
      },
      computed: {
          IdxTypeAnalyzer: function() {
              return this.itemsTypeAnalyzer.indexOf(this.typeAnalyzer);
          },
          IdxZeroModeAnalyzer: function() {
              return this.itemsZeroModeAnalyzer.indexOf(this.zeroModeAnalyzer);
          },
          GetHalfWindowL: function() {
              return Number(this.halfWindowL)
          },
          Average: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              let average = 0;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  for (let i = 0; i < channels[channelId].length; i++) {
                      average += channels[channelId][i];
                  }
                  average /= channels[channelId].length;
              }

              return average;
          },
          Dispersion: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              let average = this.Average;
              let dispersion = 0;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  for (let i = 0; i < channels[channelId].length; i++) {
                      dispersion += Math.pow(channels[channelId][i] - average, 2);
                  }
                  dispersion /= channels[channelId].length;
              }

              return dispersion;
          },
          AvgDeviation: function () {
              return Math.sqrt(this.Dispersion);
          },
          Variation: function () {
              if (Math.abs(this.Average) < Number.EPSILON) {
                  return 0;
              }

              return this.AvgDeviation / this.Average;
          },
          Asymmetry: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              let average = this.Average;
              let asymmetry = 0;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  for (let i = 0; i < channels[channelId].length; i++) {
                      asymmetry += Math.pow(channels[channelId][i] - average, 3);
                  }
                  asymmetry /= channels[channelId].length;
                  asymmetry /= Math.pow(this.AvgDeviation, 3)
              }

              return asymmetry;
          },
          Excess: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              let average = this.Average;
              let excess = 0;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  for (let i = 0; i < channels[channelId].length; i++) {
                      excess += Math.pow(channels[channelId][i] - average, 4);
                  }
                  excess /= channels[channelId].length;
                  excess /= Math.pow(this.AvgDeviation, 4)
              }

              return excess - 3;
          },
          Min: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  return Math.min(...channels[channelId]);
              }

              return 0;
          },
          Max: function () {
              let channelId = this.$store.getters.STAT_ID;
              let channels = this.$store.getters.CHANNELS;

              if (channels !== null && channels.length > 0 && this.$store.getters.STAT_DIALOG && channels[channelId].length !== 0) {
                  return Math.max(...channels[channelId]);
              }

              return 0;
          },
          Quantile1: function () {
              return this.OrderStatistic(0.05)
          },
          Quantile2: function () {
              return this.OrderStatistic(0.95)
          },
          Median: function () {
              return this.OrderStatistic(0.5)
          },
      }
  }
</script>

<style scoped>
  span {
    margin-left: 1rem;
    margin-right: 1rem;
  }
</style>
