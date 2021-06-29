import Vue from 'vue'
import Router from 'vue-router'
import Vuelidate from 'vuelidate'
import VueToast from 'vue-toast-notification';
import Vuex from 'vuex'
import 'vue-toast-notification/dist/theme-sugar.css';
import '@/assets/styles/normalize.css'

Vue.use( Router );
Vue.use(Vuelidate)
Vue.use(VueToast);
Vue.use(Vuex);

Vue.config.productionTip = false