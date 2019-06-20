import * as types from '../../mutation-types'
import { login } from '@/utils/api/api'

export async function handleLogin ({ commit, dispatch }, popup) {
  const options = { ux_mode: popup ? 'popup' : 'redirect', redirect_uri: process.env.VUE_APP_CLIENT_AUTH_REDIRECT_URI }
  const auth2 = await gapi.auth2.getAuthInstance().signIn(options)
  return requestAuth({ commit, dispatch }, auth2.Zi.id_token)
}

export function requestAuth ({ commit, dispatch }, token) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_REQUEST)
    login(token)
      .then(resp => {
        localStorage.setItem('user-token', resp.data.jwt.token)
        localStorage.setItem('user-token-expiration', resp.data.jwt.expires)
        localStorage.setItem('profile-id', resp.data.profileId)
        commit(types.SET_USERID, resp.data.userId)
        commit(types.SET_PROFILEID, resp.data.profileId)
        commit(types.AUTH_SUCCESS, resp.data.jwt.token)
        commit(types.SET_TOKEN_EXPIRATION, resp.data.jwt.expires)
        resolve(resp)
      })
      .catch(err => {
        commit(types.AUTH_ERROR, err)
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-token-expiration')
        reject(err)
      })
  })
}

export function clearLoginData ({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_LOGOUT)
    commit(types.CLEAR_PROFILEID)
    localStorage.removeItem('user-token')
    localStorage.removeItem('profile-id')
    localStorage.removeItem('user-token-expiration')
    resolve()
  })
}
