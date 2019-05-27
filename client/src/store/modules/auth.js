import * as auth from '../actions/auth'
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
  isAuthenticated: state => {
    return !!state.token && !!state.user.login
  },
  hasToken: state => !!state.token,
  authStatus: state => state.status,
  mustResetPassword: state => {
    return !!state.token && !!state.user.mustResetPassword
  }
}

const actions = {
  [auth.AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      dispatch(view.HIDE_LEFT_MENU)
      dispatch(view.SHOW_MAIN_LOADER)
      commit(auth.AUTH_REQUEST)
      apiCall('./user/auth', 'get', {}, {
        headers: {
          Authorization: user.username + ':' + hash.sha256().update(user.password).digest('hex')
        }
      })
        .then(resp => {
          localStorage.setItem(tokenNameInStorage, resp.data.token)
          dispatch(view.SHOW_LEFT_MENU)
          dispatch(view.HIDE_MAIN_LOADER)
          commit(auth.AUTH_SUCCESS, resp.data)
          // dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch(err => {
          dispatch(view.HIDE_MAIN_LOADER)
          commit(auth.AUTH_ERROR, err)
          localStorage.removeItem(tokenNameInStorage)
          reject(err.response)
        })
    })
  },
  [auth.AUTH_CHECK_TOKEN]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem(tokenNameInStorage)
      if (!token) {
        reject(new Error('Отсутствует токен авторизации'))
        return
      }
      commit(auth.AUTH_REQUEST)
      apiCall('./user/auth/token', 'get', {}, {
        headers: {
          'X-Token': token
        }
      })
        .then(resp => {
          localStorage.setItem(tokenNameInStorage, resp.data.token)
          commit(auth.AUTH_SUCCESS, resp.data)
          // dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch(err => {
          commit(auth.AUTH_ERROR, err)
          localStorage.removeItem(tokenNameInStorage)
          reject(err.response)
        })
    })
  },
  [auth.AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(auth.AUTH_LOGOUT)
      localStorage.removeItem(tokenNameInStorage)
      resolve()
    })
  }
}

const mutations = {
  [auth.AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [auth.AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.token
    state.user = resp.user
    state.hasLoadedOnce = true
  },
  [auth.AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [auth.AUTH_LOGOUT]: (state) => {
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
