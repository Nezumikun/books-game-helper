import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import view from './modules/view'
import user from './modules/user'
import game from './modules/game'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    view,
    user,
    game
  },
  strict: debug
})
