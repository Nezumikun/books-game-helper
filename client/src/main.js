import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import BootstrapVue from 'bootstrap-vue'
import './styles/custom.scss'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:8080/api'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
