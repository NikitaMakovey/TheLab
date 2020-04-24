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
                    <span
                            v-on="on"
                    >
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

      <span @click.stop="infoDialog = fileSource!==null">Инструменты</span>

      <v-dialog
              v-model="aboutDialog" fullscreen
              hide-overlay transition="dialog-bottom-transition"
      >
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

      <v-dialog
              v-model="infoDialog"
              max-width="600"
      >
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

            <v-btn
                    color="green darken-1"
                    text
                    @click="infoDialog = false"
            >
              ОК
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
          <template v-if="this.$store.getters.CHANNELS !== null">
            <div style="width: 201px; border: 1px solid black; border-radius: 5px;" class="ma-0 pa-0">
              <v-subheader class="ma-0 pa-2 title ">Каналы</v-subheader>
              <v-row
                      v-for="(data, index) in this.$store.getters.CHANNELS"
                      :key="index" class="pa-0 ma-0"
              >
                <channel-component :chartData="data" :chartName="($store.getters.NAMES)[index]" :chartId="index">
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
  import { VueContext } from 'vue-context'
  import 'vue-context/src/sass/vue-context.scss';

  export default {
    name: "ComputerGraphicsComponent",
    components: {
      'channel-component' : ChannelComponent
    },
    data() {
      return {
        viewMenu: false,
        top: '0px',
        left: '0px',

        persons: [
          'Маковей Никита',
          'Романенкова Людмила',
          'Лоншакова Анастасия',
          'Ващенко Светлана',
          'Гасанова Сабина',
        ],
        aboutDialog: false,
        infoDialog: false,

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
      setMenu: function(top, left) {
        let largestHeight = window.innerHeight - this.$$.right.offsetHeight - 25;
        let largestWidth = window.innerWidth - this.$$.right.offsetWidth - 25;

        if (top > largestHeight) top = largestHeight;

        if (left > largestWidth) left = largestWidth;

        this.top = top + 'px';
        this.left = left + 'px';
      },

      closeMenu: function() {
        this.viewMenu = false;
      },

      openMenu: function(e) {
        this.viewMenu = true;

        Vue.nextTick(function() {
          this.$$.right.focus();

          this.setMenu(e.y, e.x)
        }.bind(this));
        e.preventDefault();
      },
      showInfo: function () {

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
        let CHANNELS = null;
        const reader = new FileReader();
        const store = this.$store;
        const vm = this;
        let infoObject = this.infoObject;
        reader.onload = function() {
          let cnt = 0;
          const DATA = reader.result.split("\n").map(function (d) {
            let delta = d.split(" ");
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

              if (cnt ===  3) {
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
      drawChannels: function() {
        // TODO: something...
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
