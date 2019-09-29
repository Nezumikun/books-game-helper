import * as game from '../actions/game'
import apiCall from '../../tools/api'

const state = {
  games: []
}

const getters = {
  allGames: state => state.games
}

const actions = {
  [game.GET_LIST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(game.GET_LIST, [])
      apiCall('./game', 'get', {}, {
        headers: {
          'X-Token': data.token
        }
      })
        .then(resp => {
          commit(game.GET_LIST, resp.data)
          resolve(resp)
        })
        .catch(err => {
          console.error(err)
          commit(game.GET_LIST, [])
          reject(err)
        })
    })
  },
  [game.DELETE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      reject(new Error('Метод не реализован'))
    })
  },
  [game.SAVE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      apiCall('./game/' + data.item._id || '', 'post', { user: data.item }, {
        headers: {
          'X-Token': data.token
        }
      })
        .then(resp => {
          commit(game.SAVE, resp.data)
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
  [game.GET_LIST]: (state, resp) => {
    state.games = resp.data
  },
  [game.DELETE]: (state, item) => {
    const index = state.games.indexOf(item)
    state.games.splice(index, 1)
  },
  [game.SAVE]: (state, item) => {
    for (let i = 0; i < state.games.length; i++) {
      if (state.games[i]._id === item._id) {
        console.log('Update game id = ' + item._id)
        state.games.splice(i, 1)
        state.games.splice(i, 0, item)
        return
      }
    }
    state.games.push(item)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
