import * as types from '../../mutation-types'
import {login} from '../../../utils/api'

export function requestAuth ({commit, dispatch}, token) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_REQUEST)
    login(token)
      .then(resp => {
        localStorage.setItem('user-token', resp.data.token.token)
        // Here set the header of your ajax library to the token value.
        // example with axios
        // axios.defaults.headers.common['Authorization'] = resp.token
        commit(types.AUTH_SUCCESS, resp.data.token.token)
        resolve(resp)
      })
      .catch(err => {
        commit(types.AUTH_ERROR, err)
        localStorage.removeItem('user-token')
        reject(err)
      })
  })
}

export function logoutAuth ({commit, dispatch}) {
  return new Promise((resolve, reject) => {
    commit(types.AUTH_LOGOUT)
    localStorage.removeItem('user-token')
    resolve()
  })
}
