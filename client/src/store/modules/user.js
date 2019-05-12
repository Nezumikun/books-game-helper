import * as user from '../actions/user'
import apiCall from '../../tools/api'

const state = {
  userList: []
}

const getters = {
  allUsers: state => state.userList
}

const actions = {
  [user.GET_LIST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(user.GET_LIST, [])
      apiCall('./user', 'get', {}, {
        headers: {
          'X-Token': data.token
        }
      })
        .then(resp => {
          commit(user.GET_LIST, resp.data)
          resolve(resp)
        })
        .catch(err => {
          console.error(err)
          commit(user.GET_LIST, [])
          reject(err.response)
        })
    })
  }
}

const mutations = {
  [user.GET_LIST]: (state, resp) => {
    state.userList = resp.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
