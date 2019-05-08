import * as view from '../actions/view'

const state = {
  visibleLeftMenu: true,
  visibleMainLoader: false
}

const getters = {
  isLeftMenuVisible: state => state.visibleLeftMenu,
  isMainLoaderVisible: state => state.visibleMainLoader
}

const actions = {
  [view.SHOW_LEFT_MENU]: ({ commit, dispatch }, user) => {
    commit(view.SHOW_LEFT_MENU)
  },
  [view.HIDE_LEFT_MENU]: ({ commit, dispatch }, user) => {
    commit(view.HIDE_LEFT_MENU)
  },
  [view.SHOW_MAIN_LOADER]: ({ commit, dispatch }, user) => {
    commit(view.SHOW_MAIN_LOADER)
  },
  [view.HIDE_MAIN_LOADER]: ({ commit, dispatch }, user) => {
    commit(view.HIDE_MAIN_LOADER)
  }
}

const mutations = {
  [view.SHOW_LEFT_MENU]: (state) => {
    state.visibleLeftMenu = true
  },
  [view.HIDE_LEFT_MENU]: (state) => {
    state.visibleLeftMenu = false
  },
  [view.SHOW_MAIN_LOADER]: (state) => {
    state.visibleMainLoader = true
  },
  [view.HIDE_MAIN_LOADER]: (state) => {
    state.visibleMainLoader = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
