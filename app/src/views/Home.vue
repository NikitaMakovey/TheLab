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
              <input type="file" @change="loadFile">
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span @click.stop="dialog_info = true">Инструменты</span>
      <span>Фильтрация</span>
      <span>Анализ</span>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <span v-on="on">Настройки</span>
        </template>
        <v-card>
          <v-toolbar dark color="black">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Настройки</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">Сохранить</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>Настройки изображения</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Что-то настроить</v-list-item-title>
                <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Что-то ещё настроить</v-list-item-title>
                <v-list-item-subtitle>Require password for purchase or use password to restrict purchase</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-subheader>Общие настройки</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="notifications"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Уведомления</v-list-item-title>
                <v-list-item-subtitle>Уведомлять me about updates to apps or games that I downloaded</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="sound"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Звук</v-list-item-title>
                <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="widgets"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Автомотическое добавление окон</v-list-item-title>
                <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
      <span
              @click.stop="dialog_about = true"
      >
                Справка
            </span>
      <v-dialog
              v-model="dialog_about"
              max-width="600"
      >
        <v-card>
          <v-card-title class="headline" style="font-size: 1rem !important;">
            Система визуализации многоканальных сигналов
          </v-card-title>
          <v-card-title class="headline" style="color: #6574cd">
            Группа: Б8118-01.03.02систпро
          </v-card-title>
          <v-card-title class="headline" style="color: #a9a9a9">
            Состав команды:
          </v-card-title>

          <v-card-text>
            <p class="mb-1">Маковей Никита</p>
            <p class="mb-1">Романенкова Людмила</p>
            <p class="mb-1">Лоншакова Анастасия</p>
            <p class="mb-1">Ващенко Светлана</p>
            <p class="mb-1">Гасанова Сабина</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                    color="green darken-1"
                    text
                    @click="dialog_about = false"
            >
              ОК
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
              v-model="dialog_info"
              max-width="600"
      >
        <v-card>
          <v-card-title class="headline" style="font-size: 1rem !important;">
            Текущее состояние многоканального сигнала
          </v-card-title>

          <v-card-text>
            <p class="mb-1">Общее число каналов - {{ dialog_info === false ? null : null }}</p>
            <p class="mb-1">Общее количество отсчетов - {{ dialog_info === false ? null : null }}</p>
            <p class="mb-1">Частота дискретизации - {{ dialog_info === false ? null : null }}</p>
            <p class="mb-1">Дата и время начала записи - {{ dialog_info === false ? null : null }}</p>
            <p class="mb-1">Дата и время окончания записи - {{ dialog_info === false ? null : null }}</p>
            <p class="mb-1">
              Длительность:
              {{ dialog_info === false ? null : null }} - суток,
              {{ dialog_info === false ? null : null }} - часов,
              {{ dialog_info === false ? null : null }} - минут,
              {{ dialog_info === false ? null : null }} - секунд
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
                <td>{{ dialog_info === false ? null : null }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-card-text>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                    color="green darken-1"
                    text
                    @click="dialog_info = false"
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
              <v-row v-for="(data, index) in this.$store.getters.CHANNELS" :key="index" class="pa-0 ma-0">
                <channel-component :chartData="data" :chartName="($store.getters.NAMES)[index]">
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

  export default {
    name: "ComputerGraphicsComponent",
    components: {
      'channel-component' : ChannelComponent
    },
    data() {
      return {
        dialog_about: false,
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        dialog_info: false,
      }
    },
    methods: {
      showInfo: function () {

      },
      loadFile: function (e) {
        this.$store.dispatch('UPDATE_CHANNELS', null).then(() => {
          const file = e.target.files[0];

          let file__type = file.type;
          let file__name = file.name;
          localStorage.setItem('FILE_SOURCE', file__name);

          if (file__type === "text/plain") {
            this.readFile(file);
          }
        });
      },
      readFile: function (file) {
        let CHANNELS = null;
        const reader = new FileReader();
        const store = this.$store;
        const vm = this;
        reader.onload = function() {
          let cnt = 0;
          const DATA = reader.result.split("\n").map(function (d) {
            let delta = d.split(" ");
            if (cnt < 12) {
              //console.log(delta);
              if (cnt === 1) {
                let count_channels = Number(delta[0]);
                if (count_channels > 0 && count_channels !== null) {
                  localStorage.setItem('FILE__COUNT_CHANNELS', count_channels);
                  console.log(localStorage.getItem('FILE__COUNT_CHANNELS'));
                  CHANNELS = new Array(localStorage.getItem('FILE__COUNT_CHANNELS'));
                  for (let i = 0; i < localStorage.getItem('FILE__COUNT_CHANNELS'); i++) {
                    CHANNELS[i] = new Array(0);
                  }
                }
              }
              if (cnt ===  3) {
                let count_steps = Number(delta[delta.length - 1]);
                localStorage.setItem('FILE__COUNT_STEPS', count_steps);
                console.log(localStorage.getItem('FILE__COUNT_STEPS'));
              }
              if (cnt === 5) {
                let count_gige = Number(delta[delta.length - 1]);
                localStorage.setItem('FILE__GIGE', count_gige);
                console.log(localStorage.getItem('FILE__GIGE'));
              }
              if (cnt === 7) {
                let date_first_part = delta[0];
                localStorage.setItem('FILE__DATE_BEGIN', date_first_part);
                console.log(localStorage.getItem('FILE__DATE_BEGIN'));
              }
              if (cnt === 9) {
                let date_second_part = delta[0];
                let date_first_part = localStorage.getItem('FILE__DATE_BEGIN');
                let date_array = date_second_part.split('.');
                //date_first_part = date_array[2] + '-' + date_array[1] + '-' + date_array[0];
                let date_str = date_first_part + ' ' + date_array[0];
                let date__first = new Date(date_str);
                console.log(date__first.toDateString());
                localStorage.setItem('FILE__DATE_BEGIN', date_str);
                console.log(localStorage.getItem('FILE__DATE_BEGIN'));
                let time = localStorage.getItem('FILE__COUNT_STEPS') * (1 / localStorage.getItem('FILE__GIGE'));
                //let date_1 = new Date(localStorage.getItem('FILE__DATE_BEGIN'));
                console.log(date__first);
                let date_2 = new Date();
                date_2.setSeconds(date__first.getSeconds() + parseInt(time.toString()));
                localStorage.setItem('FILE__DATE_END', date_2.toDateString());
                console.log(localStorage.getItem('FILE__DATE_END'));
                localStorage.setItem('FILE__DATE_INFO', (parseInt(time.toString())).toString());
                console.log(localStorage.getItem('FILE__DATE_INFO'));
              }
              if (cnt === 11) {
                const CHANNELS_NAMES = d.split(";");
                store.dispatch('UPDATE_CHANNEL_NAMES', CHANNELS_NAMES).then(() => {
                  //
                })
              }
            } else {
              for (let i = 0; i < localStorage.getItem('FILE__COUNT_CHANNELS'); i++) {
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
        //console.log(this.$store.getters.CHANNELS);
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
