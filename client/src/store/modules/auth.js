import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, AUTH_CHECK_TOKEN } from '../actions/auth'
import * as view from '../actions/view'
import hash from 'hash.js'
import apiCall from '../../tools/api'

const tokenNameInStorage = 'bgh-user-token'

const state = {
  token: localStorage.getItem(tokenNameInStorage),
  status: '',
  user: {},
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token && !!state.user.login,
  hasToken: state => !!state.token,
  authStatus: state => state.status
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      dispatch(view.HIDE_LEFT_MENU)
      dispatch(view.SHOW_MAIN_LOADER)
      commit(AUTH_REQUEST)
      apiCall('./user/auth', 'get', {}, {
        headers: {
          Authorization: user.username + ':' + hash.sha256().update(user.password).digest('hex')
        }
      })
        .then(resp => {
          localStorage.setItem(tokenNameInStorage, resp.data.token)
          dispatch(view.SHOW_LEFT_MENU)
          dispatch(view.HIDE_MAIN_LOADER)
          commit(AUTH_SUCCESS, resp.data)
          // dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem(tokenNameInStorage)
          reject(err.response)
        })
    })
  },
  [AUTH_CHECK_TOKEN]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem(tokenNameInStorage)
      if (!token) {
        reject(new Error('Отсутствует токен авторизации'))
        return
      }
      commit(AUTH_REQUEST)
      apiCall('./user/auth/token', 'get', {}, {
        headers: {
          'X-Token': token
        }
      })
        .then(resp => {
          localStorage.setItem(tokenNameInStorage, resp.data.token)
          commit(AUTH_SUCCESS, resp.data)
          // dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem(tokenNameInStorage)
          reject(err.response)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem(tokenNameInStorage)
      resolve()
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.token
    state.user = resp.user
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
    state.user = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
