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
  },
  [user.DELETE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      apiCall('./user/' + data.item._id, 'delete', {}, {
        headers: {
          'X-Token': data.token
        }
      })
        .then(resp => {
          commit(user.DELETE, data.item)
          resolve()
        })
        .catch(err => {
          console.error(err)
          reject(err.response)
        })
    })
  }
}

const mutations = {
  [user.GET_LIST]: (state, resp) => {
    state.userList = resp.data
  },
  [user.DELETE]: (state, item) => {
    const index = state.userList.indexOf(item)
    state.userList.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
