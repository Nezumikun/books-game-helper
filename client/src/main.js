import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as auth from './store/actions/auth'

import Vuetify from 'vuetify'
// import './styles/custom.scss'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

const timeoutCheckToken = 60 * 1000

function checkToken () {
  return new Promise((resolve, reject) => {
    if (store.getters.isAuthenticated || store.getters.hasToken) {
      store.dispatch(auth.AUTH_CHECK_TOKEN)
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject(new Error())
        })
    } else {
      resolve()
    }
  })
}

function autoCheckToken () {
  checkToken()
    .catch(() => {
      router.push({
        path: '/login',
        query: { redirect: router.fullPath }
      })
    })
    .then(() => {
      setTimeout(function () {
        autoCheckToken()
      }, timeoutCheckToken)
    })
}

setTimeout(function () { autoCheckToken() }, timeoutCheckToken)
