import * as types from '../../mutation-types'
import * as actions from './actions'

const state = {
  token: window.localStorage ? window.localStorage.getItem('user-token') || '' : '',
  tokenExpirationTime: window.localStorage ? window.localStorage.getItem('user-token-expiration') || '' : '',
  profileId: window.localStorage ? window.localStorage.getItem('profile-id') || '' : '',
  status: '',
  hasLoadedOnce: false,
  userId: ''
}

const getters = {
  isAuthenticated: state => state.token,
  validAuth: state => state.tokenExpirationTime,
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
  [types.SET_USERID]: (state, userId) => {
    state.userId = userId
  },
  [types.SET_TOKEN_EXPIRATION]: (state, expires) => {
    state.tokenExpirationTime = expires
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
