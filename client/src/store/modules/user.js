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
          reject(err)
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
          reject(err)
        })
    })
  },
  [user.SAVE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      apiCall('./user/' + data.item._id || '', 'post', { user: data.item }, {
        headers: {
          'X-Token': data.token
        }
      })
        .then(resp => {
          commit(user.SAVE, resp.data)
          resolve()
        })
        .catch(err => {
          console.error(err)
          reject(err)
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
  },
  [user.SAVE]: (state, item) => {
    for (let i = 0; i < state.userList.length; i++) {
      if (state.userList[i]._id === item._id) {
        console.log('Update id = ' + item._id)
        state.userList.splice(i, 1)
        state.userList.splice(i, 0, item)
        return
      }
    }
    state.userList.push(item)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
