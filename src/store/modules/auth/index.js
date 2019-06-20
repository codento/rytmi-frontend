import * as types from '../../mutation-types'
import * as actions from './actions'

const getLocalstorageToken = () => {
  return window.localStorage ? window.localStorage.getItem('user-token') : null
}

const state = {
  token: window.localStorage ? window.localStorage.getItem('user-token') : '',
  tokenExpirationTime: window.localStorage ? window.localStorage.getItem('user-token-expiration') || '' : '',
  profileId: window.localStorage ? parseInt(window.localStorage.getItem('profile-id')) || undefined : undefined,
  status: '',
  isTokenValid: false,
  hasLoadedOnce: false,
  userId: ''
}

const getters = {
  isAuthenticated: state => state.token && getLocalstorageToken(),
  isTokenValid: state => state.tokenExpirationTime > Math.round(Date.now() / 1000),
  tokenValidTime: state => state.tokenExpirationTime
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
    state.token = null
    state.userId = null
    state.tokenExpirationTime = null
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
