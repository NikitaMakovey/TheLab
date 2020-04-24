import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from '@/plugins/vuetify';
const moment = require('moment');
require('moment/locale/ru');
import VueSimpleContextMenu from 'vue-simple-context-menu';

Vue.component('vue-simple-context-menu', VueSimpleContextMenu);

Vue.use(require('vue-moment'), {
  moment
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
