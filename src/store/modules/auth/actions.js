import * as types from '../../mutation-types'
import { login } from '../../../utils/api'

export function requestAuth ({ commit, dispatch }, token) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_REQUEST)
    login(token)
      .then(resp => {
        localStorage.setItem('user-token', resp.data.jwt.token)
        localStorage.setItem('profile-id', resp.data.profileId)
        commit(types.AUTH_SUCCESS, resp.data.jwt.token)
        commit(types.SET_USERID, resp.data.userId)
        commit(types.SET_PROFILEID, resp.data.profileId)
        resolve(resp)
      })
      .catch(err => {
        commit(types.AUTH_ERROR, err)
        localStorage.removeItem('user-token')
        reject(err)
      })
  })
}

export function logoutAuth ({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_LOGOUT)
    commit(types.CLEAR_PROFILEID)
    localStorage.removeItem('user-token')
    localStorage.removeItem('profile-id')
    resolve()
  })
}
