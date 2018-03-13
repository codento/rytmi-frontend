import * as types from '../../mutation-types'
import * as actions from './actions'

const state = { token: localStorage.getItem('user-token') || '', status: '', hasLoadedOnce: false, userId: '' }

const getters = {
  isAuthenticated: state => state.token,
  authStatus: state => state.status,
  getUserId: state => state.userId
}

const mutations = {
  [types.AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [types.AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
    state.hasLoadedOnce = true
  },
  [types.AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [types.AUTH_LOGOUT]: (state) => {
    state.token = ''
    state.userId = ''
  },
  [types.SET_USERID]: (state) => {
    state.userId = 10
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
